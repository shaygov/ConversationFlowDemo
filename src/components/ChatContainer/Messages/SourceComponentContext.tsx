import React, { createContext, useContext, ReactNode } from 'react';

export const SourceComponentContext = createContext<string | undefined>(undefined);

export const useSourceComponent = () => useContext(SourceComponentContext);

export const SourceComponentProvider = ({ value, children }: { value: string, children: ReactNode }) => (
  <SourceComponentContext.Provider value={value}>
    {children}
  </SourceComponentContext.Provider>
); 