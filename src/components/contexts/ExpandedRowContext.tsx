import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

type ExpandedRowContextType = {
  expandedRow: string | null;
  toggleRow: (rowId: string) => void;
  setExpandedRow: React.Dispatch<React.SetStateAction<string | null>>;
};

const ExpandedRowContext = createContext<ExpandedRowContextType | undefined>(undefined);

export const ExpandedRowProvider = ({ children }: { children: ReactNode }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (rowId: string) => {
    setExpandedRow((prevRow) => {
      return prevRow === rowId ? null : rowId;
    });
  };

  return (
    <ExpandedRowContext.Provider value={{ expandedRow, toggleRow, setExpandedRow }}>
      {children}
    </ExpandedRowContext.Provider>
  );
};

export const useExpandedRow = () => {
  const context = useContext(ExpandedRowContext);
  if (!context) {
    throw new Error('useExpandedRow must be used within an ExpandedRowProvider');
  }
  return context;
};
