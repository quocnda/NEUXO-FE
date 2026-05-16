/* eslint-disable no-continue */
// components/LetterheadEditor.jsx

import { useMutation } from '@tanstack/react-query';
import { AlignCenter, AlignLeft, AlignRight, Paperclip, Plus, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import toast from 'react-hot-toast';

import { useEmailSignature } from '@/api/email-template';
import { uploadFile } from '@/api/email-tracking';
import { Icons } from '@/assets/icons';
import { onMutateError } from '@/lib/common';
import { MIME } from '@/lib/mime';
import { cn } from '@/lib/utils';
import ModalSignature from '@/features/email-template/components/ModalSignature';
import { valueVariables } from '@/features/email-tracking/utils/const';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import Caption3 from './ui/typography/caption3';
import { HStack, Show } from './ui/Utilities';

interface ILetterheadEditorProps {
  setSendFile: React.Dispatch<React.SetStateAction<any[]>>;
  sendFile: any[];
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  noAction?: boolean;
  className?: string;
  handleInsertSignature?: (val: string) => void;
  isDisabled?: boolean;
}
const LetterheadEditor = ({
  setSendFile,
  sendFile,
  value,
  onChange,
  noAction,
  className,
  handleInsertSignature,
  isDisabled,
}: ILetterheadEditorProps) => {
  const contentEditableRef = useRef<any>(null);
  const [openSignature, setOpenSignature] = useState(false);

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = `<img src="${e.target.result}" style="max-height: 100px; vertical-align: middle; margin: 0 10px;" />`;
        insertImageIntoContentEditable(img);
      };
      reader.readAsDataURL(file);
      event.target.value = null;
    }
  };

  const insertImageIntoContentEditable = (img: string) => {
    const editor = contentEditableRef.current;
    const currentContent = editor.innerHTML;

    const newContent = currentContent + img;

    editor.innerHTML = newContent;

    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const formatDoc = (command: string, val?: string) => {
    document.execCommand(command, false, val);
  };
  const { data: dataSignature, refetch: refetchSignature } = useEmailSignature();

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
  const applyFont = (font: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontFamily = font;
    span.textContent = selection.toString();

    range.deleteContents();
    range.insertNode(span);
  };
  const handleInsertVariable = (val: string) => {
    const editor = contentEditableRef.current;
    if (editor) {
      const currentContent = editor.innerHTML;
      const newContent = `${currentContent} <span>${val}</span>`;

      editor.innerHTML = newContent;

      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const getFontSizeValue = (pixels: number): string => {
    if (pixels <= 12) return '1';
    if (pixels <= 14) return '2';
    if (pixels <= 16) return '3';
    if (pixels <= 18) return '4';
    if (pixels <= 20) return '5';
    if (pixels <= 22) return '6';
    if (pixels <= 24) return '7';
    if (pixels <= 26) return '8';
    if (pixels <= 28) return '9';
    if (pixels <= 30) return '10';
    if (pixels <= 32) return '11';
    if (pixels <= 34) return '12';
    if (pixels <= 36) return '13';
    if (pixels <= 38) return '14';
    if (pixels <= 40) return '15';
    if (pixels <= 42) return '16';

    return '16';
  };

  const [fontSize, setFontSize] = useState(14);
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pixelSize = e.target.value;
    setFontSize(Number(pixelSize));

    const htmlSize = getFontSizeValue(Number(pixelSize));

    document.execCommand('fontSize', false, htmlSize);

    const elements = contentEditableRef.current?.getElementsByTagName('font');
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.size) {
          element.removeAttribute('size');
          element.style.fontSize = `${pixelSize}px`;
        }
      }
    }

    onChange(contentEditableRef.current.innerHTML);
  };

  return (
    <div className={'letterhead-editor'}>
      <style jsx global>{`
        .toolbar {
          padding: 8px;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .toolbar button {
          cursor: pointer;
        }

        .toolbar button:hover {
          background: #e8e8e8;
        }

        .content-area {
          min-height: 300px;
          padding: 16px;
          overflow-y: auto;
        }

        .content-area:focus {
          outline: none;
        }
        .toolbar select {
          cursor: pointer;
          font-size: 12px;
        }

        .toolbar select:focus {
          outline: none;
          border-color: #3182ce;
        }

        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }

        select::-ms-expand {
          display: none;
        }

        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #0000008a;
        }

        .font-size-select {
          font-size: 14px;
          color: #0000008a;
        }
      `}</style>

      <div className="editor-body">
        <ContentEditable
          innerRef={contentEditableRef}
          html={value}
          disabled={isDisabled}
          onChange={(e) => handleChange(e.target.value)}
          className={cn('content-area rounded-sm border-2 border-[#e8e8e8] text-sm', className)}
          data-placeholder="Enter your text here..."
        />
        <div className="toolbar">
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
            <Paperclip size={14} color="#0000008A" />
            <input
              id="file-upload"
              type="file"
              multiple
              className="pointer-events-none absolute bottom-0 left-0 z-10 h-6 w-full cursor-pointer px-0 py-0 opacity-0"
              onChange={handleUploadFile}
            />
          </button>
          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <button
            onClick={() => {
              const imageUpload = document.getElementById('imageUpload');
              if (imageUpload) {
                imageUpload.click();
              }
            }}
            type="button"
          >
            <Icons.image width={14} height={14} />
          </button>
          <div className="h-[20px] w-[1px] bg-gray-300"></div>
          <select value={fontSize} onChange={handleFontSizeChange} className="font-size-select">
            {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40].map((size) => (
              <option key={size} value={size}>
                {`${size}px`}
              </option>
            ))}
          </select>
          <div className="h-[20px] w-[1px] bg-gray-300"></div>
          <select
            onChange={(e) => applyFont(e.target.value)}
            defaultValue=""
            className="w-[80px] rounded-sm bg-white text-sm text-gray-500"
          >
            <option value="" disabled>
              Font Family
            </option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="'Roboto', sans-serif">Roboto</option>
          </select>

          <div className="h-[20px] w-[1px] bg-gray-300"></div>
          <button type="button" onClick={() => formatDoc('bold')}>
            <Icons.bold width={14} height={14} />
          </button>
          <button type="button" onClick={() => formatDoc('italic')}>
            <Icons.itatic width={14} height={14} />
          </button>
          <button type="button" onClick={() => formatDoc('underline')}>
            <Icons.underline width={14} height={14} />
          </button>
          <div className="h-[20px] w-[1px] bg-gray-300"></div>
          <button type="button" onClick={() => formatDoc('justifyLeft')}>
            <AlignLeft color="#0000008A" size={18} />
          </button>
          <button type="button" onClick={() => formatDoc('justifyCenter')}>
            <AlignCenter color="#0000008A" size={18} />
          </button>
          <button type="button" onClick={() => formatDoc('justifyRight')}>
            <AlignRight color="#0000008A" size={18} />
          </button>
          <Show when={!noAction}>
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
                      onClick={() => handleInsertVariable(option.value)}
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
                        onClick={() => handleInsertSignature?.(option.signature_html)}
                      >
                        {option.signature_name}
                      </DropdownMenuItem>
                    )
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer items-center gap-2 px-3 py-2 text-xs font-normal hover:bg-[#E5E4E4]"
                    onClick={() => setOpenSignature(true)}
                  >
                    <Plus size={16} />
                    Signature
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </Show>
        </div>
        <Show when={(sendFile ?? []).length > 0}>
          <HStack spacing={4} className="py-2">
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
      </div>
      <Show when={openSignature}>
        <ModalSignature isOpen={openSignature} setIsOpen={setOpenSignature} refetch={refetchSignature} />
      </Show>
    </div>
  );
};

export default LetterheadEditor;
