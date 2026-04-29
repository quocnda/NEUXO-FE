/* eslint-disable no-nested-ternary */
import { useMutation } from '@tanstack/react-query';
import { Dot, LucideDownloadCloud } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

import { checkHadOtherWatchlist, insertMutipleCompany } from '@/api/company';
import { Icons } from '@/assets/icons';
import Tag from '@/components/TagComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import { Tooltip } from '@/components/ui/tooltip';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack, VStack } from '@/components/ui/Utilities';
import Wrapper from '@/components/Wrapper';
import { formatFileSize, onMutateError, shortenName } from '@/lib/common';
import { env } from '@/lib/const';
import { MIME } from '@/lib/mime';
import { cn } from '@/lib/utils';
import type { FCC } from '@/types';
import { typeHeaderTable } from '@/utils/const';

import ModalcheckHadOtherWatchlist from '../Watchlist/ModalcheckHadOtherWatchlist';
import { predefinedHeaders } from './const/type';

interface IModalUploadExcelProps {
  isShowUpload: boolean;
  setIsShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}
const ModalUploadExcel: FCC<IModalUploadExcelProps> = ({ children, setIsShowUpload, isShowUpload, refetch }) => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [fileName, setFileName] = useState<{ name: string; size: string }>({
    name: '',
    size: '',
  });
  const [isAllValid, setIsAllValid] = useState(false);
  const [statusList, setStatusList] = useState<string[]>([]);

  const handleToggle = () => {
    setIsShowUpload(!isShowUpload);
    setExcelData([]);
    setFileName({
      name: '',
      size: '',
    });
  };
  const { mutate: checkHadOtherWatchlistMutate } = useMutation(checkHadOtherWatchlist, {
    onSuccess: (data) => {
      const updatedStatusList = data.map((item: any) => item?.status?.message);
      setIsAllValid(
        updatedStatusList.every(
          (status: string) =>
            status === 'Valid' ||
            status === "Warning: Company is in your teammate's watchlist. You can still add it to yours"
        )
      );
      setStatusList(updatedStatusList);
    },
  });

  const handleCheckHadOtherWatchlist = useCallback(() => {
    if (excelData.length > 0) {
      checkHadOtherWatchlistMutate({
        watchlist_info: excelData,
      });
    }
  }, [checkHadOtherWatchlistMutate, excelData]);

  useEffect(() => {
    handleCheckHadOtherWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excelData]);

  const getWarningCompanyNamesString = () => {
    const warningCompanyNames = excelData
      .filter(
        (_, index) =>
          statusList[index] === "Warning: Company is in your teammate's watchlist. You can still add it to yours"
      )
      .map((item) => item.company_name);

    if (warningCompanyNames.length === 0) return '';
    if (warningCompanyNames.length === 1) return warningCompanyNames[0];

    return `${warningCompanyNames.slice(0, -1).join(', ')} and ${warningCompanyNames[warningCompanyNames.length - 1]}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const MAX_FILE_SIZE = 50 * 1024 * 1024;

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds the 50MB limit. Please upload a smaller file.');
      return;
    }

    if (file?.type !== MIME.xlsx) {
      toast.error('Please upload excel file');
      return;
    }
    if (file && file.type === MIME.xlsx) {
      setFileName({
        name: file?.name as string,
        size: file?.size.toString() as string,
      });
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet, { defval: null, header: 1 }) as string[][];
        const headers: string[] = json[0];
        const isHeadersValid = predefinedHeaders.every((header) => headers.includes(header));
        if (!isHeadersValid) {
          setFileName({
            name: '',
            size: '',
          });
          toast.error('The uploaded file headers do not match the required format.');
          return;
        }
        const rowData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        const cleanedData = rowData.map((row: any) => {
          const filteredRow = Object.fromEntries(
            Object.entries(row).filter(([key, value]) => headers.includes(key) || value !== null)
          );
          return filteredRow;
        });
        setExcelData(cleanedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const warningCompanyNames = getWarningCompanyNamesString();

  const renderTable = () => {
    if (excelData.length === 0) return null;
    const headers = Object.keys(excelData[0]);
    const customHeader = [
      ...headers.map((item) => ({
        title: item,
        type: typeHeaderTable.DATA,
      })),
      { title: 'Status', type: typeHeaderTable.DATA },
    ];

    return (
      <Wrapper className="overflow-auto">
        <CommonTable
          listHeader={customHeader}
          bodyComponent={
            <>
              <TableSkeleton col={headers.length} />
              {excelData?.map((item: any, index: number) => {
                const status = statusList[index];

                return (
                  <RowTable key={index}>
                    {customHeader
                      ?.filter((i) => i.title !== 'Status')
                      .map((i: any, z: number) => {
                        return (
                          <ItemRowTable indexRow={index} tableLength={excelData.length} className="text-sm" key={z}>
                            <Tooltip
                              hidden={!(item[i.title] && item[i.title].length > 20)}
                              label={item[i.title]}
                              className="text-xs"
                            >
                              <div>
                                <TextBody1>{shortenName(item[i.title], 20) || '-'}</TextBody1>
                              </div>
                            </Tooltip>
                          </ItemRowTable>
                        );
                      })}
                    <ItemRowTable indexRow={index} tableLength={excelData.length} className="text-sm">
                      <p
                        className={`${
                          status === 'Valid'
                            ? 'text-green-500'
                            : status ===
                              "Warning: Company is in your teammate's watchlist. You can still add it to yours"
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}
                      >
                        {status}
                      </p>
                    </ItemRowTable>
                  </RowTable>
                );
              })}
            </>
          }
          footerComponent={<></>}
        />
      </Wrapper>
    );
  };

  const { mutate } = useMutation(insertMutipleCompany, {
    onError: onMutateError,
    onSuccess: () => {
      setIsOpenConfirm(false);
      setIsShowUpload(false);
      setExcelData([]);
      setFileName({
        name: '',
        size: '',
      });
      toast.success('Upload watchlist successfully!');
      refetch?.();
    },
  });

  const handleSubmit = () => {
    const hasWarning = statusList.some(
      (status) => status === "Warning: Company is in your teammate's watchlist. You can still add it to yours"
    );
    if (hasWarning) {
      setIsOpenConfirm(true);
      return;
    }

    mutate({
      records: excelData,
    });
  };

  return (
    <>
      <Dialog open={isShowUpload} onOpenChange={handleToggle}>
        <DialogTrigger onClick={handleToggle} asChild className="cursor-pointer">
          {children}
        </DialogTrigger>
        <DialogContent
          className={cn('max-h-screen overflow-y-auto overflow-x-hidden', fileName?.name && 'max-w-screen-lg')}
        >
          <DialogHeader>
            <DialogTitle>
              <Tag className="bg-secondary-blue" classNameContent="text-xl">
                Upload Excel
              </Tag>
            </DialogTitle>
          </DialogHeader>

          {fileName?.name ? (
            <div className="bg-neutral-20 rounded-[9.93px] p-3">
              <HStack pos={'apart'} className="items-start">
                <VStack className="gap-[6.11px]">
                  <p className="text-xs font-medium">{fileName?.name}</p>
                  <HStack>
                    <span className="flex items-center text-xs font-normal text-[#A9ACB4]">
                      {formatFileSize(Number(fileName?.size))} of {formatFileSize(Number(fileName?.size))}
                      <Dot />
                    </span>
                    <p className="flex items-center gap-2 text-xs font-normal text-[#292D32]">
                      <Icons.greenTick width={14} height={14} />
                      Completed
                    </p>
                  </HStack>
                </VStack>

                <Icons.remove
                  width={16}
                  height={16}
                  className="cursor-pointer hover:opacity-50"
                  onClick={() => {
                    setFileName({
                      name: '',
                      size: '',
                    });
                    setExcelData([]);
                  }}
                />
              </HStack>
            </div>
          ) : (
            <div className="relative flex h-[160px] w-full flex-col items-center justify-center gap-4 rounded-[3px] border-[3px] border-dashed border-[#CBD0DC]">
              <input
                type="file"
                value=""
                accept="xlsx"
                onChange={handleFileUpload}
                className="absolute bottom-0 left-0 h-full w-[100%] cursor-pointer opacity-0"
              />
              <LucideDownloadCloud size={25} />
              <VStack className="gap-[5.73px]" align="center">
                <p className="text-xs font-medium">Choose a file or drag & drop it here</p>
                <p className="text-xs font-medium text-[#A9ACB4]">Xlsx formats, up to 50MB</p>
              </VStack>{' '}
              <div className="w-fit rounded-[6.11px] border border-[#CBD0DC] px-[12.6px] py-[6.11px] text-xs font-medium text-[#54575C]">
                Browse File
              </div>
            </div>
          )}
          <ul className="list-inside list-disc text-xs font-medium decoration-solid">
            <p>Upload watchlist from Excel (.xlsx) file:</p>
            <li className="my-1">
              Open{' '}
              <a href={env.URL_TEMPLATE_INSERT_WATCHLIST} className="text-blue-500" target="_blank">
                Template_Watchlist
              </a>{' '}
              Excel file, select File {'->'} Make a copy
            </li>
            <li className="my-1">Fill the information, with Company linkedin and Company ICP as required field</li>
            <li className="my-1">Download the file in .xlsx format</li>
            <li className="my-1">Upload the file and make sure all records&#39; status are valid</li>
          </ul>
          {renderTable()}

          <Button disabled={!isAllValid || excelData.length === 0} onClick={handleSubmit}>
            Upload
          </Button>
        </DialogContent>
      </Dialog>
      <ModalcheckHadOtherWatchlist
        isOpenConfirm={isOpenConfirm}
        setIsOpenConfirm={setIsOpenConfirm}
        mutate={() => {
          mutate({
            records: excelData,
          });
        }}
        warningCompanyNames={warningCompanyNames}
      />
    </>
  );
};

export default ModalUploadExcel;
