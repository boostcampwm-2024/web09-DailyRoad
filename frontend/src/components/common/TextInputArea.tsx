import React from 'react';

type TextInputAreaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  height?: number;
  isTextArea?: boolean;
};

const TextInputArea = ({
  value,
  onChange,
  placeholder,
  maxLength,
  height = 20,
  isTextArea = false,
}: TextInputAreaProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex w-full justify-between">
      {isTextArea ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{ height: `${height}px` }}
          className="gray text-customText bg-customGray w-full rounded-lg border-none p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className="text-customText bg-customGray w-full rounded-lg border-none p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
      {maxLength && (
        <div className="text-xs text-c_placeholder_gray">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default TextInputArea;
