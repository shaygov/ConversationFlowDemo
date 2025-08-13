import { create } from 'zustand';

interface IComponentData {
 [key: string]: any;
}

export interface IModalState {
  content: {
    component: string | null;
    props: any;
  };
  params: any;
  set: (componentData: IComponentData | null, modalParams?: any) => void;
  reset: () => void;
}

const defaultData: any = {
  content: null,
  params: {},
};

const store = create()(
  (set, get: any) => ({
    content: defaultData,
    params: {},
    set: (
      componentData: IComponentData | null = null, 
      modalParams?: any
    ) => {
      const content = {
        component: componentData ? Object.keys(componentData)[0] : defaultData.component,
        props: componentData ? Object.values(componentData)[0] : defaultData.props,
      };

      const params = !content ? defaultData.params : {
        ...get().params,
        ...(modalParams || {})
      };

      set({ 
        content,
        params,
      });
    },
    reset: () => set({ 
      content: defaultData,
      params: {},
    }),
  })
);

export default store;
