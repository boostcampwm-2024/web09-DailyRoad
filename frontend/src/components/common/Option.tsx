type OptionProps = {
    label: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
  };
  
  const Option = ({ label, description, isSelected, onClick }: OptionProps) => (
    <div
      onClick={onClick}
      className={`p-2 h-[50px] rounded-lg border-[1.5px] cursor-pointer flex items-center gap-2 ${
        isSelected ? 'border-[#00A3FF]' : 'border-gray-300'
      }`}
    >
      <div className={`font-bold text-center`}>
        {label}
      </div>
    <p>|</p>
      <span className="text-gray-500 ml-2 text-sm">{description}</span>
    </div>
  );

  export default Option;