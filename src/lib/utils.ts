import { type ClassValue, clsx } from 'clsx';
import toast from 'react-hot-toast';
import { extendTailwindMerge } from 'tailwind-merge';

import { useUserStore } from '@/stores';

import { env } from './const';

const twMerge = extendTailwindMerge({
  classGroups: {
    'font-size': ['text-xxs'],
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function unslugify(str: string) {
  return str.replace(/-/g, ' ');
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files);
  if (!isArray) return false;
  return files.every((file) => file instanceof File);
}

/* eslint-disable @typescript-eslint/no-unused-expressions */
export function removeItem<T>([...arr]: T[], item: T) {
  const index = arr.indexOf(item);
  index > -1 && arr.splice(index, 1);
  return arr;
}

export function closestItem<T>(arr: T[], item: T) {
  const index = arr.indexOf(item);
  if (index === -1) {
    return arr[0];
  }
  if (index === arr.length - 1) {
    return arr[arr.length - 2];
  }
  return arr[index + 1];
}

export const range = (start: number, end: number) => {
  const length = end - start + 1;
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};
export function debounceV2(fn: any, wait: any) {
  let timeout: any;
  return (...args: any[]) => {
    window.clearTimeout(timeout);
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    timeout = window.setTimeout(fn, wait, ...args);
  };
}
export const onDownload = (blob: any, fileName: any) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  const title = fileName === '' ? 'CSV Report' : fileName;

  link.href = url;
  link.setAttribute('download', `${title} - created ${new Date().toDateString()}.csv`);
  link.click();
  link.parentNode?.removeChild(link);
};

export const exportAsyncCSVFile = async ({
  url,
  fileName,
  params,
}: {
  url: string;
  fileName?: string;
  params?: any;
}) => {
  try {
    const token = useUserStore.getState().access_token;
    const response = await fetch(`${env.API_URL}${url}?${new URLSearchParams(params as any)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || 'csv-file.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download file successfully !');
    } else {
      toast.error(`Download fail - ${response?.statusText}`);
    }
  } catch (error: any) {
    toast.error(`Download fail: ${error?.message}`);
  }
};

export const removeUndefinedKeys = <T extends Record<string, any>>(obj: T): T => {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined)) as T;
};

export const downloadBase64File = (base64String: string, fileName: string, fileType: any) => {
  try {
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('Invalid base64 string');
    }

    const byteCharacters = atob(base64String);
    const byteArray = new Uint8Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: fileType });
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(blobUrl);
  } catch (error: any) {
    console.error('Error downloading file:', error);
    throw new Error(`Failed to download file: ${error.message}`);
  }
};
