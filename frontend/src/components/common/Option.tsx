type OptionProps = {
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
};

const Option = ({ label, description, isSelected, onClick }: OptionProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="option"
      aria-selected={isSelected}
      className={`flex h-[50px] cursor-pointer items-center gap-2 rounded-lg border-[1.5px] p-2 ${
        isSelected ? 'border-[#00A3FF]' : 'border-gray-300'
      }`}
    >
      <div className={`text-sm font-bold`}>{label}</div>
      <div className="text-gray-300" aria-hidden="true">
        |
      </div>
      <span className="ml-2 text-sm text-gray-500">{description}</span>
    </button>
  );
};

export default Option;
