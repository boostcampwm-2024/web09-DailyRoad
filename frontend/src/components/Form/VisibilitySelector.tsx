import Option from '@/components/common/Option';

type VisibilitySelectorProps = {
  selected: 'public' | 'private';
  onSelect: (selected: 'public' | 'private') => void;
};

const VisibilitySelector = ({
  selected,
  onSelect,
}: VisibilitySelectorProps) => {
  return (
    <div className="flex flex-col gap-2 bg-white">
      <h2 className="text-lg font-bold">공개 범위</h2>
      <p className="mb-4 text-gray-600">공개 여부를 선택해주세요</p>

      <Option
        label="공개"
        description="나의 지도를 다른 사람들과 공유할 수 있습니다."
        isSelected={selected === 'public'}
        onClick={() => onSelect('public')}
      />

      <Option
        label="비공개"
        description="나의 지도를 나만 볼 수 있습니다."
        isSelected={selected === 'private'}
        onClick={() => onSelect('private')}
      />
    </div>
  );
};

export default VisibilitySelector;
