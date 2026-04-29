/* eslint-disable no-continue */
import { useMutation } from '@tanstack/react-query';
import { Paperclip, X } from 'lucide-react';
import React, { useRef } from 'react';
import toast from 'react-hot-toast';

import { useEmailSignature } from '@/api/email-template';
import { uploadFile } from '@/api/email-tracking';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HStack, Show } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import { MIME } from '@/lib/mime';
import { cn } from '@/lib/utils';
import { valueVariables } from '@/modules/EmailTracking/utils/const';

import Caption3 from './ui/typography/caption3';

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

interface IProps {
  editorText: string;
  setEditorText: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  readOnly?: boolean;
  setSendFile?: React.Dispatch<
    React.SetStateAction<
      {
        file_name: any;
        file_path: string;
      }[]
    >
  >;
  sendFile?: { file_name: any; file_path: string }[];
  className?: string;
  noUpload?: boolean;
}
const CustomToolbar = ({
  onInsertVariable,
  handleUploadFile,
  dataSignature,
  handleInsertSignature,
  noUpload,
}: {
  onInsertVariable: (value: string) => void;
  handleUploadFile: (e: any) => void;
  dataSignature: any;
  handleInsertSignature: (value: string) => void;
  noUpload?: boolean;
}) => {
  return (
    <div id="toolbar">
      <span className="ql-formats">
        <Show when={!noUpload}>
          <button
            className="relative flex h-fit items-center justify-center bg-white text-gray-500"
            type="button"
            onClick={() => {
              const fileInput = document.getElementById('file-upload') as HTMLInputElement | null;
              if (fileInput) {
                fileInput.click();
              }
            }}
          >
            <Paperclip size={15} color="black" />
            <input
              id="file-upload"
              type="file"
              multiple
              className="pointer-events-none absolute bottom-0 left-0 z-10 h-6 w-full cursor-pointer px-0 py-0 opacity-0"
              onChange={handleUploadFile}
            />
          </button>
        </Show>

        <button className="ql-link" />
        <button className="ql-video" />
        <button className="ql-image" />
        {/* <button className="ql-code-block" /> */}
      </span>
      <span className="ql-formats">
        <select className="ql-size" />
        <select className="ql-font" />
      </span>

      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-blockquote" />
      </span>
      <span className="ql-formats">
        <select className="ql-align" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
      </span>
      <span className="ql-formats">
        <button className="ql-clean" />
      </span>
      <Show when={!noUpload}>
        <span className="ql-formats">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="mt-[2.5px] cursor-pointer">
                <Caption3>Dynamic Variables</Caption3>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[9999] w-fit border">
              {valueVariables.map((option: { value: string; label: string }, index) => (
                <DropdownMenuItem
                  className="cursor-pointer px-3 py-2 text-xs font-normal hover:bg-[#E5E4E4]"
                  key={index}
                  onClick={() => onInsertVariable(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
        <span className="ql-formats">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="mt-[2.5px] cursor-pointer">
                <Caption3>Signature</Caption3>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[9999] max-h-[200px] w-fit overflow-auto border">
              {dataSignature?.list_signatures?.map(
                (
                  option: {
                    signature_html: string;
                    id: number;
                    signature_name: string;
                  },
                  index: React.Key | null | undefined
                ) => (
                  <DropdownMenuItem
                    className="cursor-pointer px-3 py-2 text-xs font-normal hover:bg-[#E5E4E4]"
                    key={index}
                    onClick={() => handleInsertSignature(option.signature_html)}
                  >
                    {option.signature_name}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </Show>
    </div>
  );
};
const EditText: React.FunctionComponent<IProps> = (props: IProps) => {
  const { editorText, setEditorText, disabled, readOnly, setSendFile, sendFile, className, noUpload } = props;

  const editorRef = useRef<any>(null);
  const handleEditorChange = (editorTextParams: string) => {
    setEditorText(editorTextParams);
  };
  const { data: dataSignature } = useEmailSignature({ enabled: !noUpload });

  const { mutate: uploadFileMutate } = useMutation(uploadFile, {
    onSuccess: (res: any) => {
      setSendFile?.((prev) => [...prev, ...res.attachments]);
    },
    onError: onMutateError,
  });

  const handleUploadFile = async (e: any) => {
    const { files } = e.target;
    const maxSize = 15 * 1024 * 1024;
    const allowedTypes = [MIME.docx, MIME.xlsx, MIME.zip, MIME.pdf, MIME.jpg, MIME.png, MIME.jpeg];
    const newFiles: { file_name: any; file_path: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (sendFile?.some((existingFile) => existingFile.file_name === file.name)) {
        toast.error(`The file "${file.name}" is already uploaded.`);
        continue;
      }

      if (!allowedTypes.includes(file?.type)) {
        toast.error(`The file "${file?.name}" is not in the required format!`);
        continue;
      }

      if (file?.size > maxSize) {
        toast.error(`The file "${file?.name}" exceeds the maximum upload size of 15MB.`);
        continue;
      }
      const formUpload = new FormData();
      formUpload.append('file', file);
      uploadFileMutate(formUpload as any);
    }
    setSendFile?.((prevFiles) => [...prevFiles, ...newFiles]);
    e.target.value = null;
  };

  const handleDeleteFile = (indexToDelete: number) => {
    const updatedFiles = sendFile?.filter((_, index) => index !== indexToDelete);
    setSendFile?.(updatedFiles ?? []);
  };

  const handleInsertVariable = (value: string) => {
    const editor = editorRef.current?.editor;
    if (editor) {
      const range = editor.getSelection();
      const position = range ? range.index : 0;
      editor.insertText(position, value);
    }
  };

  const handleInsertSignature = (value: string) => {
    setEditorText((prevText: string) => prevText + value);
  };

  return (
    <>
      <div className="w-full">
        <ReactQuill
          className={cn('shadow-sm', className)}
          ref={editorRef}
          theme="snow"
          style={{
            height: '350px',
            maxHeight: 350,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: disabled ? '' : '#fff',
            pointerEvents: disabled ? 'none' : 'unset',
          }}
          placeholder="Compose your email..."
          readOnly={readOnly}
          value={editorText}
          modules={{
            toolbar: {
              container: '#toolbar',
            },
          }}
          onChange={handleEditorChange}
        />
        <Show when={(sendFile ?? []).length > 0}>
          <HStack spacing={4} className="pt-4">
            {sendFile?.map((file: any, index: number) => (
              <div
                key={index}
                className="flex w-fit cursor-pointer items-center justify-between gap-3 rounded-md border border-blue-500 px-3 py-1 text-blue-500 hover:opacity-60"
              >
                <a href={file?.file_path} target="_blank" className="text-xs">
                  {file?.file_name}
                </a>
                <span className="cursor-pointer" onClick={() => handleDeleteFile(index)}>
                  <X size={14} color="red" />
                </span>
              </div>
            ))}
          </HStack>
        </Show>

        <CustomToolbar
          onInsertVariable={handleInsertVariable}
          handleUploadFile={handleUploadFile}
          dataSignature={dataSignature}
          handleInsertSignature={handleInsertSignature}
          noUpload={noUpload}
        />
      </div>

      <style jsx global>{`
        .ql-toolbar {
          margin-left: 0 !important;
          padding-left: 0 !important;
        }
      `}</style>
    </>
  );
};

export default EditText;
