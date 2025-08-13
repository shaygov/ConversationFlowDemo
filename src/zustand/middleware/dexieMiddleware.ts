import { db } from '../../../db';

interface Params {
  name: string; // The Dexie table name
  persist?: string[]; // The keys to persist
}

type ZustandMiddleware = (set: any, get: any, api: any) => any;

// Filters out non-serializable values (like functions)
const getSerializableState = (state: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(state).filter(([_, value]) => typeof value !== 'function')
  );
};

export const dexieMiddleware = (config: ZustandMiddleware, params: Params): ZustandMiddleware => {
  const { name, persist = [] } = params;
  const table = db[name];

  const loadFromDexie = async (set: any) => {
    try {

      if (!table) {
        throw new Error(`Table "${name}" does not exist in Dexie.`);
      }

      const items = await table.toArray();
      const initialState = items.reduce((acc: Record<string, any>, { key, value }: any) => {
        if (persist.includes(key)) { // Only load keys listed in "persist"
          acc[key] = value;
        }

        return acc;
      }, {});

      set(initialState);
    } catch (error) {
      console.error('Error loading from Dexie:', error);
    }
  };

  const saveToDexie = async (state: Record<string, any>) => {
    try {
      if (!table) {
        throw new Error(`Table "${name}" does not exist in Dexie.`);
      }

      await table.clear(); // Clear previous entries

      const serializableState = getSerializableState(state);
      const entries = Object.entries(serializableState)
        .filter(([key]) => persist.includes(key)) // Only save keys listed in "persist"
        .map(([key, value]) => ({ key, value }));

      await table.bulkPut(entries);
    } catch (error) {
      console.error('Error saving to Dexie:', error);
    }
  };

  return (set, get, api) => {
    if (persist.length > 0) {
      loadFromDexie(set); // Only load if there are keys to persist
    }

    return config(
      (args: any) => {
        set(args);

        const shouldPersist = Object.keys(args).some((key) => persist.includes(key));
        
        if (shouldPersist) {
          saveToDexie(get());
        }
      },
      get,
      api
    );
  };
};