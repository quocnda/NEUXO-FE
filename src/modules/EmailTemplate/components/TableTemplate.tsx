import dayjs from 'dayjs';
import { Edit3, LayoutTemplateIcon, PenBox, Search, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import type { IResponseEmailTemplate } from '@/api/email-template';
import Empty from '@/components/Empty';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, LoadingIcon } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/table';
import CommonTable from '@/components/ui/tableV2/commonTable';
import ItemRowTable from '@/components/ui/tableV2/itemRowTable';
import RowTable from '@/components/ui/tableV2/rowTable';
import TextBody1 from '@/components/ui/typography/TextBody1';
import { HStack, Show, VStack } from '@/components/ui/Utilities';
import { shortenHTMLContent } from '@/lib/common';
import { cn, debounceV2 } from '@/lib/utils';

import useServices from '../hooks/useServices';
import { listHeaderTemplateEmail } from '../utils/const';
import ModalAddEmailTemplate from './ModalAddEmailTemplate';
import ModalSignature from './ModalSignature';

const TableTemplate = () => {
  const [isDownloadAll, setIsDownloadAll] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [templateInfo, setTemplateInfo] = useState<{ templateName: string; templateId: string }>({
    templateName: '',
    templateId: '',
  });

  const { data, isFetching, paramsQuery, refetch, setParamsQuery, removeTemplate, isLoading } =
    useServices(setIsRemove);

  const handleInputChange = debounceV2((e: React.ChangeEvent<HTMLInputElement>) => {
    setParamsQuery({ ...paramsQuery, search: e.target.value });
  }, 300);

  useEffect(() => {
    const temp: any[] = [];
    if (isDownloadAll) {
      data?.map((s: IResponseEmailTemplate) => temp.push(s.id));
    } else {
      selectedIds.map((s: any) => temp.push(s));
    }
    setSelectedIds(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDownloadAll, data]);

  return (
    <>
      <HStack pos="apart" className="my-4">
        <div className="max-w-[400px]">
          <Input
            placeholder={'Search'}
            name="search"
            className="border-neutral-30 h-8 border-2 text-xs"
            suffix={<Search size={16} color="#808080" />}
            onChange={handleInputChange}
          />
        </div>
        <HStack>
          <ModalSignature refetch={refetch} isOpen={isOpen} setIsOpen={setIsOpen}>
            <Button variant={'outline'} className="flex h-8 items-center gap-2 rounded-md px-3 text-xs font-normal">
              <PenBox size={14} />
              Signature
            </Button>
          </ModalSignature>
          <ModalAddEmailTemplate refetch={refetch}>
            <Button className="flex h-8 items-center gap-2 rounded-md px-3 text-xs font-normal">
              <LayoutTemplateIcon size={14} />
              New Template
            </Button>
          </ModalAddEmailTemplate>
        </HStack>
      </HStack>
      <VStack spacing={0}>
        <CommonTable
          listHeader={listHeaderTemplateEmail}
          checkBox={
            <Checkbox
              checked={isDownloadAll}
              onCheckedChange={(e) => {
                if (e) {
                  setIsDownloadAll(true);
                } else {
                  setIsDownloadAll(false);
                  setSelectedIds([]);
                }
              }}
            />
          }
          bodyComponent={
            <>
              <TableSkeleton loading={isFetching} col={(listHeaderTemplateEmail.length ?? 0) + 1} />
              <Show when={data?.length !== 0 && !isFetching}>
                {data?.map((item: IResponseEmailTemplate, index: number) => {
                  const checkExist = selectedIds.find((s) => s === item?.id);
                  return (
                    <RowTable
                      key={index}
                      rowClassName={cn((checkExist !== undefined || isDownloadAll) && 'bg-blue-50 hover:bg-blue-50')}
                    >
                      <ItemRowTable indexRow={index} tableLength={data.length} className="text-center">
                        <Checkbox
                          checked={checkExist !== undefined || isDownloadAll}
                          onCheckedChange={(e: any) => {
                            setIsDownloadAll(false);
                            if (e) {
                              setSelectedIds?.([...(selectedIds as any[]), item?.id]);
                            } else {
                              setSelectedIds?.(selectedIds?.filter((s) => s !== item?.id) as any[]);
                            }
                          }}
                        />
                      </ItemRowTable>
                      <ItemRowTable indexRow={index} tableLength={data.length}>
                        <TextBody1>{item?.template_name ?? '-'}</TextBody1>
                      </ItemRowTable>
                      <ItemRowTable indexRow={index} tableLength={data.length}>
                        <VStack spacing={4}>
                          <TextBody1 className="font-medium">{item?.template_subject ?? '-'}</TextBody1>
                          <TextBody1
                            dangerouslySetInnerHTML={{ __html: shortenHTMLContent(item?.template_content) ?? '' }}
                          />
                        </VStack>
                      </ItemRowTable>

                      <ItemRowTable indexRow={index} tableLength={data?.length}>
                        <TextBody1>{dayjs(item?.updated_at).format('YYYY-MM-DD') ?? '-'}</TextBody1>
                      </ItemRowTable>
                      <ItemRowTable indexRow={index} tableLength={data?.length}>
                        <HStack spacing={8} noWrap>
                          <ModalAddEmailTemplate refetch={refetch} templateInfo={templateInfo}>
                            <Edit3
                              size={14}
                              color="green"
                              onClick={() =>
                                setTemplateInfo({ templateName: item?.template_name, templateId: item?.id })
                              }
                            />
                          </ModalAddEmailTemplate>
                          <AlertDialog open={isRemove} onOpenChange={() => setIsRemove(!isRemove)}>
                            <AlertDialogTrigger asChild>
                              <Trash
                                className="cursor-pointer"
                                size={14}
                                color="#FF0000"
                                onClick={() =>
                                  setTemplateInfo({ templateName: item?.template_name, templateId: item?.id })
                                }
                              />
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogTitle className="text-center text-lg">
                                Are you sure you want to remove {templateInfo?.templateName}?
                              </AlertDialogTitle>
                              <HStack pos={'center'} noWrap>
                                <AlertDialogCancel className="w-full" onClick={() => setIsRemove(false)}>
                                  Cancel
                                </AlertDialogCancel>{' '}
                                <AlertDialogAction
                                  className="w-full"
                                  onClick={() => removeTemplate(templateInfo.templateId)}
                                >
                                  Remove
                                  {isLoading && <LoadingIcon className="ml-4" />}
                                </AlertDialogAction>
                              </HStack>
                            </AlertDialogContent>
                          </AlertDialog>
                        </HStack>
                      </ItemRowTable>
                    </RowTable>
                  );
                })}
              </Show>
            </>
          }
          footerComponent={<></>}
        />
        <Show when={!isFetching && (data?.length === 0 || !data)}>
          <Empty />
        </Show>
      </VStack>
    </>
  );
};

export default TableTemplate;
