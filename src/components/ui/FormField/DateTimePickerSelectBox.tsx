import type { VariantProps } from 'class-variance-authority';
import dayjs from 'dayjs';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { FormControl, FormField, FormItem, FormMessage } from '../form';
import type { selectTriggerVariants } from '../select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { HStack } from '../Utilities';

interface IData {
  label: string;
  value: string;
  image?: string;
  group?: string;
}
interface IListData {
  dateData: IData[];
  monthData: IData[];
  yearData: IData[];
  hourData: IData[];
  minutesData: IData[];
}
interface Props<T extends FieldValues = FieldValues>
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectTriggerVariants> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  labelClassName?: string;
  data?: IListData;
  field?: any;
}
const dateData = [
  { label: '01', value: '1' },
  { label: '02', value: '2' },
  { label: '03', value: '3' },
  { label: '04', value: '4' },
  { label: '05', value: '5' },
  { label: '06', value: '6' },
  { label: '07', value: '7' },
  { label: '08', value: '8' },
  { label: '09', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' },
  { label: '20', value: '20' },
  { label: '21', value: '21' },
  { label: '22', value: '22' },
  { label: '23', value: '23' },
  { label: '24', value: '24' },
  { label: '25', value: '25' },
  { label: '26', value: '26' },
  { label: '27', value: '27' },
  { label: '28', value: '28' },
  { label: '29', value: '29' },
  { label: '30', value: '30' },
  { label: '31', value: '31' },
];
const monthData = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];
const yearData = [
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
  { label: '2028', value: '2028' },
  { label: '2029', value: '2029' },
  { label: '2030', value: '2030' },
  { label: '2031', value: '2031' },
  { label: '2032', value: '2032' },
  { label: '2033', value: '2033' },
  { label: '2034', value: '2034' },
  { label: '2035', value: '2035' },
  { label: '2036', value: '2036' },
  { label: '2037', value: '2037' },
  { label: '2038', value: '2038' },
  { label: '2039', value: '2039' },
  { label: '2040', value: '2040' },
  { label: '2041', value: '2041' },
  { label: '2042', value: '2042' },
  { label: '2043', value: '2043' },
  { label: '2044', value: '2044' },
  { label: '2045', value: '2045' },
  { label: '2046', value: '2046' },
  { label: '2047', value: '2047' },
  { label: '2048', value: '2048' },
  { label: '2049', value: '2049' },
  { label: '2050', value: '2050' },
  { label: '2051', value: '2051' },
  { label: '2052', value: '2052' },
  { label: '2053', value: '2053' },
  { label: '2054', value: '2054' },
  { label: '2055', value: '2055' },
  { label: '2056', value: '2056' },
  { label: '2057', value: '2057' },
  { label: '2058', value: '2058' },
  { label: '2059', value: '2059' },
  { label: '2060', value: '2060' },
  { label: '2061', value: '2061' },
  { label: '2062', value: '2062' },
  { label: '2063', value: '2063' },
  { label: '2064', value: '2064' },
  { label: '2065', value: '2065' },
  { label: '2066', value: '2066' },
  { label: '2067', value: '2067' },
  { label: '2068', value: '2068' },
  { label: '2069', value: '2069' },
  { label: '2070', value: '2070' },
  { label: '2071', value: '2071' },
  { label: '2072', value: '2072' },
  { label: '2073', value: '2073' },
  { label: '2074', value: '2074' },
  { label: '2075', value: '2075' },
  { label: '2076', value: '2076' },
  { label: '2077', value: '2077' },
  { label: '2078', value: '2078' },
  { label: '2079', value: '2079' },
  { label: '2080', value: '2080' },
  { label: '2081', value: '2081' },
  { label: '2082', value: '2082' },
  { label: '2083', value: '2083' },
  { label: '2084', value: '2084' },
  { label: '2085', value: '2085' },
  { label: '2086', value: '2086' },
  { label: '2087', value: '2087' },
  { label: '2088', value: '2088' },
  { label: '2089', value: '2089' },
  { label: '2090', value: '2090' },
  { label: '2091', value: '2091' },
  { label: '2092', value: '2092' },
  { label: '2093', value: '2093' },
  { label: '2094', value: '2094' },
  { label: '2095', value: '2095' },
  { label: '2096', value: '2096' },
  { label: '2097', value: '2097' },
  { label: '2098', value: '2098' },
  { label: '2099', value: '2099' },
  { label: '2100', value: '2100' },
];
const hourData = [
  { label: '00', value: '0' },
  { label: '01', value: '1' },
  { label: '02', value: '2' },
  { label: '03', value: '3' },
  { label: '04', value: '4' },
  { label: '05', value: '5' },
  { label: '06', value: '6' },
  { label: '07', value: '7' },
  { label: '08', value: '8' },
  { label: '09', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' },
  { label: '20', value: '20' },
  { label: '21', value: '21' },
  { label: '22', value: '22' },
  { label: '23', value: '23' },
];
const minutesData = [
  { label: '00', value: '0' },
  { label: '01', value: '1' },
  { label: '02', value: '2' },
  { label: '03', value: '3' },
  { label: '04', value: '4' },
  { label: '05', value: '5' },
  { label: '06', value: '6' },
  { label: '07', value: '7' },
  { label: '08', value: '8' },
  { label: '09', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' },
  { label: '20', value: '20' },
  { label: '21', value: '21' },
  { label: '22', value: '22' },
  { label: '23', value: '23' },
  { label: '24', value: '24' },
  { label: '25', value: '25' },
  { label: '26', value: '26' },
  { label: '27', value: '27' },
  { label: '28', value: '28' },
  { label: '29', value: '29' },
  { label: '30', value: '30' },
  { label: '31', value: '31' },
  { label: '32', value: '32' },
  { label: '33', value: '33' },
  { label: '34', value: '34' },
  { label: '35', value: '35' },
  { label: '36', value: '36' },
  { label: '37', value: '37' },
  { label: '38', value: '38' },
  { label: '39', value: '39' },
  { label: '40', value: '40' },
  { label: '41', value: '41' },
  { label: '42', value: '42' },
  { label: '43', value: '43' },
  { label: '44', value: '44' },
  { label: '45', value: '45' },
  { label: '46', value: '46' },
  { label: '47', value: '47' },
  { label: '48', value: '48' },
  { label: '49', value: '49' },
  { label: '50', value: '50' },
  { label: '51', value: '51' },
  { label: '52', value: '52' },
  { label: '53', value: '53' },
  { label: '54', value: '54' },
  { label: '55', value: '55' },
  { label: '56', value: '56' },
  { label: '57', value: '57' },
  { label: '58', value: '58' },
  { label: '59', value: '59' },
];
const data: IListData = {
  dateData,
  monthData,
  yearData,
  hourData,
  minutesData,
};
const RenderField = ({
  field,
  variant,
  inputSize,
  fullWidth,
  className,
}: {
  field: any;
  variant: VariantProps<typeof selectTriggerVariants>['variant'];
  inputSize: VariantProps<typeof selectTriggerVariants>['inputSize'];
  fullWidth?: boolean;
  className?: string;
}) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [second, setSecond] = useState('');
  const [timeStampCheck, setTimeStampCheck] = useState<string>('');

  const handleSetField = () => {
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
    const timestamp = Math.floor(date.getTime() / 1000);
    setTimeStampCheck(String(timestamp));
    field.onChange(String(timestamp));
  };
  useEffect(() => {
    if (!field.value || field.value === timeStampCheck) return;
    const date = dayjs(Number(field.value) * 1000);
    setDay(String(date.date()));
    setMonth(String(date.month() + 1));
    setYear(String(date.year()));
    setHour(String(date.hour()));
    setMinute(String(date.minute()));
    setSecond(String(date.second()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  useEffect(() => {
    if (day && month && year && hour && minute && second) handleSetField();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, hour, minute, month, second, year]);

  return (
    <div className={cn('relative flex flex-col ', fullWidth ? 'w-full' : '')}>
      <FormItem>
        <HStack spacing={8}>
          <Select onValueChange={(e) => setDay(e)} value={day}>
            <FormControl>
              <div>
                <SelectTrigger
                  variant={variant}
                  inputSize={inputSize}
                  className={cn(className, { 'w-full': fullWidth })}
                >
                  <SelectValue />
                </SelectTrigger>
              </div>
            </FormControl>

            <SelectContent>
              {data.dateData.map((x) => (
                <SelectItem key={x.value} value={x.value}>
                  {x.image ? (
                    <div className="flex items-center space-x-2">
                      {x.image && <img src={x.image!} alt="" className="h-6 w-6" />}
                      <p>{x.label}</p>
                    </div>
                  ) : (
                    x.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(e) => setMonth(e)} value={month}>
            <FormControl>
              <div>
                <SelectTrigger
                  variant={variant}
                  inputSize={inputSize}
                  className={cn(className, { 'w-full': fullWidth })}
                >
                  <SelectValue className="w-28" />
                </SelectTrigger>
              </div>
            </FormControl>

            <SelectContent>
              {data.monthData.map((x) => (
                <SelectItem key={x.value} value={x.value}>
                  {x.image ? (
                    <div className="flex items-center space-x-2">
                      {x.image && <img src={x.image!} alt="" className="h-6 w-6" />}
                      <p>{x.label}</p>
                    </div>
                  ) : (
                    x.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(e) => setYear(e)} value={year}>
            <FormControl>
              <div>
                <SelectTrigger
                  variant={variant}
                  inputSize={inputSize}
                  className={cn(className, { 'w-full': fullWidth })}
                >
                  <SelectValue className="w-16" />
                </SelectTrigger>
              </div>
            </FormControl>

            <SelectContent>
              {data.yearData.map((x) => (
                <SelectItem key={x.value} value={x.value}>
                  {x.image ? (
                    <div className="flex items-center space-x-2">
                      {x.image && <img src={x.image!} alt="" className="h-6 w-6" />}
                      <p>{x.label}</p>
                    </div>
                  ) : (
                    x.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(e) => setHour(e)} value={hour}>
            <FormControl>
              <div>
                <SelectTrigger
                  variant={variant}
                  inputSize={inputSize}
                  className={cn(className, { 'w-full': fullWidth })}
                >
                  <SelectValue />
                </SelectTrigger>
              </div>
            </FormControl>

            <SelectContent>
              {data.hourData.map((x) => (
                <SelectItem key={x.value} value={x.value}>
                  {x.image ? (
                    <div className="flex items-center space-x-2">
                      {x.image && <img src={x.image!} alt="" className="h-6 w-6" />}
                      <p>{x.label}</p>
                    </div>
                  ) : (
                    x.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(e) => setMinute(e)} value={minute}>
            <FormControl>
              <div>
                <SelectTrigger
                  variant={variant}
                  inputSize={inputSize}
                  className={cn(className, { 'w-full': fullWidth })}
                >
                  <SelectValue />
                </SelectTrigger>
              </div>
            </FormControl>

            <SelectContent>
              {data.minutesData.map((x) => (
                <SelectItem key={x.value} value={x.value}>
                  {x.image ? (
                    <div className="flex items-center space-x-2">
                      {x.image && <img src={x.image!} alt="" className="h-6 w-6" />}
                      <p>{x.label}</p>
                    </div>
                  ) : (
                    x.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(e) => setSecond(e)} value={second}>
            <FormControl>
              <div>
                <SelectTrigger
                  variant={variant}
                  inputSize={inputSize}
                  className={cn(className, { 'w-full': fullWidth })}
                >
                  <SelectValue />
                </SelectTrigger>
              </div>
            </FormControl>

            <SelectContent>
              {data.minutesData.map((x) => (
                <SelectItem key={x.value} value={x.value}>
                  {x.image ? (
                    <div className="flex items-center space-x-2">
                      {x.image && <img src={x.image!} alt="" className="h-6 w-6" />}
                      <p>{x.label}</p>
                    </div>
                  ) : (
                    x.label
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </HStack>

        <FormMessage className="mt-1 text-xs" />
      </FormItem>
    </div>
  );
};
const DateTimePickerSelectBox = <T extends FieldValues>({
  name,
  defaultValue,
  control,
  label,
  required,
  variant,
  inputSize,
  fullWidth,
  className,
  labelClassName,
  ...props
}: Props<T>) => {
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field }) => (
        <RenderField field={field} variant={undefined} inputSize={undefined} className={className} />
      )}
    />
  );
};

export { DateTimePickerSelectBox };
