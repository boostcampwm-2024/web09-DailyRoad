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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full flex justify-between">
      {isTextArea ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{ height: `${height}px` }}
          className="w-full gray p-2 rounded-lg border-none text-customText bg-customGray focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full p-2 rounded-lg border-none text-customText bg-customGray focus:outline-none focus:ring-2 focus:ring-blue-500"
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
