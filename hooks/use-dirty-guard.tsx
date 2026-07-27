'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type DirtyGuardContextType = {
  isDirty: boolean;
  dirtyFields: string[];
  setDirty: (fields: string[]) => void;
  clearDirty: () => void;
};

const DirtyGuardContext = createContext<DirtyGuardContextType>({
  isDirty: false,
  dirtyFields: [],
  setDirty: () => {},
  clearDirty: () => {},
});

export function DirtyGuardProvider({ children }: { children: ReactNode }) {
  const [dirtyFields, setDirtyFields] = useState<string[]>([]);

  const setDirty = useCallback((fields: string[]) => {
    setDirtyFields(fields);
  }, []);

  const clearDirty = useCallback(() => {
    setDirtyFields([]);
  }, []);

  return (
    <DirtyGuardContext.Provider
      value={{ isDirty: dirtyFields.length > 0, dirtyFields, setDirty, clearDirty }}
    >
      {children}
    </DirtyGuardContext.Provider>
  );
}

export const useDirtyGuard = () => useContext(DirtyGuardContext);
