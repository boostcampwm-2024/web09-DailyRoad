import React from 'react';

type TextInputAreaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength: number;
  height?: number;
  isTextArea?: boolean;
};

const TextInputArea = ({
  value,
  onChange,
  placeholder,
  maxLength,
  height,
  isTextArea = false,
}: TextInputAreaProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(e.target.value);
  };

  return (
    <div
      style={{ height: height }}
      className="flex w-full items-center justify-between rounded-md border-[1px] px-1"
    >
      {isTextArea ? (
        <>
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            aria-label={placeholder || '텍스트 입력 영역'}
            role="textbox"
            aria-multiline="true"
            className="gray bg-customGray h-full w-full rounded-lg border-none p-2 text-base focus:outline-none"
          />
          <div className="flex h-full flex-col-reverse text-xs text-c_placeholder_gray">
            <p>
              {value.length}/{maxLength}
            </p>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            aria-label={placeholder || '텍스트 입력'}
            className="bg-customGray w-full rounded-lg border-none p-2 text-sm focus:outline-none"
          />
          <div className="text-xs text-c_placeholder_gray">
            {value.length}/{maxLength}
          </div>
        </>
      )}
    </div>
  );
};

export default TextInputArea;
