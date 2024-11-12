type OptionProps = {
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
};

const Option = ({ label, description, isSelected, onClick }: OptionProps) => (
  <div
    onClick={onClick}
    className={`flex h-[50px] cursor-pointer items-center gap-2 rounded-lg border-[1.5px] p-2 ${
      isSelected ? 'border-[#00A3FF]' : 'border-gray-300'
    }`}
  >
    <div className={`text-center font-bold`}>{label}</div>
    <p>|</p>
    <span className="ml-2 text-sm text-gray-500">{description}</span>
  </div>
);

export default Option;
