import type { AxiosResponse as AxiosRes } from 'axios';

declare module 'axios' {
  export interface AxiosResponse<T = any, D = any> extends AxiosRes<T, D> {
    data: T;
    meta?: any;
    status: number;
    statusText: string;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
    config: InternalAxiosRequestConfig<D>;
    request?: any;
  }
}
