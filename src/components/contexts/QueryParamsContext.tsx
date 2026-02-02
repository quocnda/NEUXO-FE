import React, { createContext, useContext, useState } from 'react';

interface QueryParams {
  [key: string]: { page: number; limit: number };
}

interface QueryParamsContextType {
  queryParams: QueryParams;
  setQueryParams: (key: string, params: { page: number; limit: number }) => void;
}

const QueryParamsContext = createContext<QueryParamsContextType | undefined>(undefined);

export const QueryParamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryParams, setQueryParamsState] = useState<QueryParams>({});

  const setQueryParams = (key: string, params: { page: number; limit: number }) => {
    setQueryParamsState((prev) => ({
      ...prev,
      [key]: params,
    }));
  };

  return <QueryParamsContext.Provider value={{ queryParams, setQueryParams }}>{children}</QueryParamsContext.Provider>;
};

export const useQueryParams = () => {
  const context = useContext(QueryParamsContext);
  if (!context) {
    throw new Error('useQueryParams must be used within a QueryParamsProvider');
  }
  return context;
};
