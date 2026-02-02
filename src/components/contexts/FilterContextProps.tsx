import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

interface FiltersContextProps {
  selectedFilters: { [key: string]: string[] };
  setSelectedFilters: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
}

const FiltersContext = createContext<FiltersContextProps | undefined>(undefined);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});

  return <FiltersContext.Provider value={{ selectedFilters, setSelectedFilters }}>{children}</FiltersContext.Provider>;
};

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
};
