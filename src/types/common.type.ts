export interface IPaging {
  page?: number;
  limit?: number;
}

export interface IListPaging<T extends unknown = any[]> {
  pagination: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  result: T[];
}

export interface ISelectOption<T extends any = any> {
  label: string;
  value: T;
  des?: string;
}

export type TypeItemTable = {
  indexRow: number;
  tableLength: number;
};
export interface IAxiosResponse<T extends unknown> {
  data: T;
  meta: {
    pagination: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  };
}

export interface ObjectLiteral<T extends unknown = string> {
  [s: string]: T;
}

export interface IOption<T extends any = any> {
  name: string;
  value: T;
}

export interface IdType {
  id: any;
}

export interface IListResponse<T extends unknown> {
  data: T[];
  meta: {
    pagination: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  };
}

export interface IData {
  label: string;
  value: string;
  image?: string;
  error?: boolean;
  group?: string;
}
export type ElementProps<ElementType extends React.ElementType, PropsToOmit extends string = never> = Omit<
  React.ComponentPropsWithoutRef<ElementType>,
  PropsToOmit
>;
