import { X } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

interface IProps {
  data: string[];
  value: string;
  setValue: any;
  removeEmail: (index: number) => void;
  handleAddEmail: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

const EmailRender = (props: IProps) => {
  const { data, value, setValue, removeEmail, handleAddEmail, className } = props;
  const [isInputFocused, setIsInputFocused] = useState(false);
  const maxVisibleEmails = 3;
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsInputFocused(false);
    }
  };
  return (
    <div
      style={{
        borderBottom: '1px solid #ccc',
        maxWidth: '100%',
      }}
      onBlur={handleBlur}
    >
      <div className={cn('flex flex-wrap items-center pl-10 pr-20', className)}>
        {(isInputFocused ? data : data.slice(0, maxVisibleEmails)).map((email: string, index: number) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px 10px',
              borderRadius: '15px',
              margin: '5px',
            }}
            className="bg-blue-500 text-xs text-white"
          >
            {email}
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                removeEmail(index);
              }}
              style={{
                marginLeft: '10px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {!isInputFocused && data.length > maxVisibleEmails && (
          <span className="ml-2 text-xs text-gray-500">+{data.length - maxVisibleEmails} more</span>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleAddEmail}
          onFocus={() => setIsInputFocused(true)}
          style={{
            flex: '1',
            minWidth: '150px',
            padding: '10px',
            border: 'none',
            outline: 'none',
            backgroundColor: '#fff',
          }}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default EmailRender;
