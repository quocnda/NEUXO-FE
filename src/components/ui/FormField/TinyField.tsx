import { Editor } from '@tinymce/tinymce-react';
import type { ReactNode } from 'react';
import React, { memo, useRef, useState } from 'react';
import type { Control, FieldPath, FieldPathValue, FieldValues, UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { LoadingIcon } from '../button';
import { FormControl, FormItem } from '../form';

interface Props<T extends FieldValues = any> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  label?: ReactNode;
  required?: boolean;
  labelClassName?: string;
  form: UseFormReturn<T>;
}

const TinyField = ({ name, control, form }: Props) => {
  const editorRef = useRef<any>();
  const [loading, setLoading] = useState(true);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <FormItem>
          <FormControl>
            <div className="relative h-[15.625rem]">
              {loading && (
                <div
                  className="
                  bg-primary-foreground/80 absolute left-0 top-0 z-[50] flex h-[15.625rem] w-full items-center justify-center gap-3 backdrop-blur-md"
                >
                  <LoadingIcon size="2rem" />
                  <p className="italic">Loading Text Editor...</p>
                </div>
              )}
              <Editor
                apiKey="pgevnk4l6mxwlgrkan9nfxtkpvoghnpj0xjgy2gx0nssn6lf"
                onInit={(evt, editor) => {
                  editorRef.current = editor;
                  setTimeout(() => {
                    setLoading(false);
                  }, 200);
                }}
                onEditorChange={(event, editor) => {
                  onChange(event);
                  form.setValue('content', editor.getContent({ format: 'text' }), { shouldValidate: true });
                }}
                init={{
                  branding: false,
                  height: 250,
                  // skin_url: './skins/ui/gray',
                  menubar: false,
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'code',
                    'help',
                    'wordcount',
                    'anchor',
                  ],
                  toolbar:
                    'undo redo | blocks  | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help',

                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px ;z-index: 999999; }',
                }}
                // onEditorChange={onChange}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default memo(TinyField);
