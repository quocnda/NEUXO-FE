import { differenceInCalendarDays, format } from 'date-fns';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import type { DateRange } from '@/components/ui/date-picker-custom';
import type { TimeRange } from '@/components/ui/date-picker-custom/date-range-picker';

import { DATETIME_FORMAT } from './const';
import { getMutateError } from './getMutateError';
import { COUNTRIES_LIST } from './phoneCode';
import { REGEX_EMOJI, REGEX_NO_SPECIAL_CHARACTERS } from './regex';

export function capitalizeFirstLetter(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function shortenString(str?: string, length = 10) {
  if (!str) return '';
  if (str?.length < length) return str;
  return `${str.substring(0, length)}...${str.substring(str.length - 4)}`;
}

export function shortenName(str?: string, length = 20) {
  if (!str) return '';
  if (str?.length <= length) return str;
  return `${str.substring(0, length)}...`;
}

export const shortenEmail = (email?: string) => {
  if (!email) return '***@gmail.com';
  return email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < gp3.length; i++) {
      // eslint-disable-next-line no-param-reassign
      gp2 += '*';
    }
    return gp2;
  });
};

export const getSCTime = (time?: any) => {
  if (!time) return BigInt(0);
  const formatTime = String(time).length === 13 ? Math.floor(+time / 1000) : time;
  return formatTime as any;
};

export const onMutateError = (err: any) => {
  toast.error(getMutateError(err));
};

export const sleep = async (time: number) => {
  return new Promise<void>((resolve) =>
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(() => {
      resolve();
    }, time)
  );
};

export const debounce = <F extends (...args: any) => any>(func: F, waitFor: number) => {
  const timeout = 0;

  const debounced = (...args: any) => {
    clearTimeout(timeout);
    setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

export const getSignMessage = (nonce: number) => {
  return (
    'Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!' +
    ` Nonce: ${nonce}`
  );
};

export const getMessageSignature = (nonce?: number) => {
  const msg =
    'Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!';

  return nonce ? `${msg} Nonce: ${nonce}` : msg;
};

export const validateFileSize = (file: File, size = 10): boolean => {
  if (!file || typeof file === 'string') return true;
  return file?.size <= size * 1024 * 1024;
};

export const getFileName = (file: string) => {
  return file.substr(file.lastIndexOf('\\') + 1).split('.')[0];
};

export const formatFileName = (name: string) => {
  const dotIndex = name.lastIndexOf('.');
  return name.substring(0, dotIndex);
};

export const validateFolder = (webkitRelativePath: string) => {
  return webkitRelativePath.split('/').length >= 2;
};

export const isSameAddress = (addrA?: string | null, addrB?: string | null) => {
  return addrA?.toLowerCase() === addrB?.toLowerCase();
};

// eslint-disable-next-line @typescript-eslint/no-shadow
export const parseDate = (timestamp: number, format?: string) =>
  dayjs.unix(timestamp).format(format || 'DD/MM/YYYY hh:mm:ss A');

export const parseDateWithoutTime = (timestamp: number) => dayjs.unix(timestamp).format('DD/MM/YYYY');

export const parseTime = (timestamp: number) => dayjs.unix(timestamp).format('hh:mm:ss A');

export const requiredMessage = (field?: string) => (field ? `${field} field is required` : 'This field is required');

export const validateEmoji = (text: string): boolean => {
  return REGEX_EMOJI.test(text);
};

export const validateCharacterSpecial = (text: string) => {
  return !REGEX_NO_SPECIAL_CHARACTERS.test(text);
};
export function shortenWord(longWord: string): string {
  if (!longWord) return '';
  if (longWord.length <= 20) {
    return longWord || '';
  }
  const shortened = `${longWord.slice(0, 10)}...${longWord.slice(-10)}`;
  return shortened || '';
}
export function formatRoundedNumber(number: number, decimalPlaces: number): string {
  // const roundedNumber = Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
  const roundedNumber = +Number(number).toFixed(decimalPlaces);

  // return formattedNumber;
  return roundedNumber.toString();
}
export const formatTokenAmount = (amount: number) => {
  return formatRoundedNumber(amount, 6);
};

export const formatRMAmount = (amount: number) => {
  return formatRoundedNumber(amount, 2);
};

export const formatIfNumber = (str: string) => {
  if (!Number.isNaN(str) && !Number.isNaN(parseFloat(str))) return Number(str).toLocaleString();
  return str;
};

const relativeTime = require('dayjs/plugin/relativeTime');

export const getTimeFromNow = (timeStamp: string | number) => {
  dayjs.extend(relativeTime);
  return dayjs(Number(timeStamp)).fromNow();
};

export function formatNumberWithSuffix(number: number) {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let suffixIndex = 0;

  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    number /= 1000;
    suffixIndex++;
  }

  const formattedNumber = number.toFixed(2);
  const suffix = suffixes[suffixIndex];

  return formattedNumber + suffix;
}

export const formatNumber = (number?: number, fractionDigits?: number): string => {
  if (number === 0) return '0';
  if (typeof number !== 'number' || !number) return 'N/A';

  if (Number.isInteger(number)) {
    return number.toLocaleString('en-US');
  }

  const roundedString: string = number.toFixed(fractionDigits || 2);

  const formattedNumber: string = parseFloat(roundedString).toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits || 2,
    maximumFractionDigits: fractionDigits || 2,
  });

  return formattedNumber;
};

export const phonePrefixOptions = COUNTRIES_LIST.map((item, i) => {
  return { label: `+ ${item.countryCallingCode}`, value: String(i) }; // value = index because duplicate value key
});

export const getPhonePrefixIndexValue = (value: string) => {
  return phonePrefixOptions.find((item) => item.label === value)?.value ?? '';
};
export const formatDate = (date: string | Date, formatString?: string): string => {
  if (!date) return '';

  const formattedDate = format(new Date(date), formatString || DATETIME_FORMAT.MONTH_DATE_YEAR);

  return formattedDate;
};
export const formatTime = (date: string | Date, formatString?: string): string => {
  if (!date) return '';

  const formattedTime = format(new Date(date), formatString || 'HH:mm');

  return formattedTime;
};

export const formatDateRange = (date: Date, time: string) => {
  const formatRange = date ? formatDate(date!, DATETIME_FORMAT.DATE_TIME) : null;
  const formatTimeRange = time && formatRange ? `${formatDate(date!, DATETIME_FORMAT.DATE_TIME)} ${time}` : null;

  return {
    formatRange,
    formatTimeRange,
  };
};
export const formatDateTimeRange = (dateRange: DateRange, timeRange: TimeRange) => {
  const formatDateFrom = formatDateRange(dateRange?.from!, timeRange?.from!);

  const formatDateTo = formatDateRange(dateRange?.to!, timeRange?.to!);

  return {
    formatRangeFrom: formatDateFrom.formatRange,
    formatRangeTo: formatDateTo.formatRange,
    formatTimeRangeFrom: formatDateFrom.formatTimeRange,
    formatTimeRangeTo: formatDateTo.formatTimeRange,
  };
};
export function formatItem(item: string) {
  return item
    ?.split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const formatStatus = (status: string | undefined) => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().split('_').join(' ');
};

export function formatAmount(amount: number) {
  const thousand = 1000;
  const million = 1000000;
  const billion = 1000000000;

  if (amount >= billion) {
    return `${amount / billion}B`;
  }
  if (amount >= million) {
    return `${amount / million}M`;
  }
  if (amount >= thousand) {
    return `${amount / thousand}K`;
  }
  return amount?.toLocaleString();
}

export const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Copied');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy');
      });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    toast.success('Copied');
  }
};

export function formatTimeDay(time: string) {
  if (!time) return '';
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const utcDate = new Date(time);
  const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone }));

  const now = new Date();
  const localNow = new Date(now.toLocaleString('en-US', { timeZone }));

  const daysDifference = differenceInCalendarDays(localNow, localDate);

  if (daysDifference === 0) {
    return `Today ${format(localDate, 'h:mm a')}`;
  }
  if (daysDifference === 1) {
    return `Yesterday ${format(localDate, 'h:mm a')}`;
  }
  return format(localDate, 'MMMM d, yyyy h:mm a');
}

export const getFirstSentence = (htmlContent: string) => {
  const doc = new DOMParser().parseFromString(htmlContent, 'text/html');

  const firstParagraph = doc.querySelector('p');
  return firstParagraph ? firstParagraph.innerHTML : '';
};

export const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  if (sizeInBytes < 1024 * 1024 * 1024) return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export function replaceBorderStyles(htmlContent: string) {
  const regex =
    /border-(top|right|bottom|left)-width\s*:\s*([^;]+);?|border-(top|right|bottom|left)-color\s*:\s*([^;]+);?/gi;

  const tempStyles: Record<string, { width?: string; color?: string }> = {
    top: {},
    right: {},
    bottom: {},
    left: {},
  };

  const updatedContent = htmlContent.replace(regex, (match, dir1, width, dir2, color) => {
    const direction = dir1 || dir2;

    if (width) {
      tempStyles[direction].width = width.trim();
    }
    if (color) {
      tempStyles[direction].color = color.trim();
    }

    if (tempStyles[direction].width && tempStyles[direction].color) {
      const result = `border-${direction}: ${tempStyles[direction].width} solid ${tempStyles[direction].color};`;
      tempStyles[direction] = {};
      return result;
    }

    return '';
  });

  return updatedContent;
}

export const shortenHTMLContent = (htmlContent: string, maxLength = 40) => {
  if (!htmlContent) return '';

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  const textContent = tempDiv.textContent || tempDiv.innerText || '';

  return textContent.length > maxLength ? `${textContent.substring(0, maxLength)}...` : textContent;
};

export const formatToDateTime = (date: Date | undefined, isEndDate: boolean = false): string | undefined => {
  if (!date) return undefined;

  let localDate: Date;
  if (isEndDate) {
    localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
  } else {
    localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const localOffset = localDate.getTimezoneOffset();
  const adjustedDate = new Date(localDate.getTime() + localOffset * 60000);

  return formatDate(adjustedDate, DATETIME_FORMAT.DATE_TIME_LOCAL);
};

export const formatToDate = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;

  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return formatDate(localDate, DATETIME_FORMAT.DATE_TIME);
};
