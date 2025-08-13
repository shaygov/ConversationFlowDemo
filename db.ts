import Dexie from 'dexie';

const db: any = new Dexie('ChatMessenger');

db.version(1).stores({
  users: 'key, value',
  channel_cache: 'key, value',
});

export { db };


