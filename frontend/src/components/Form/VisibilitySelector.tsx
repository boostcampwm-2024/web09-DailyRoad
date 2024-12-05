import Option from '@/components/common/Option';

import { VISIBILITY_TEXTS } from '@/constants/map';

type VisibilitySelectorProps = {
  selected: 'public' | 'private';
  onSelect: (selected: 'public' | 'private') => void;
};

const VisibilitySelector = ({
  selected,
  onSelect,
}: VisibilitySelectorProps) => {
  return (
    <div
      className="flex flex-col gap-2 bg-white"
      role="radiogroup"
      aria-label={VISIBILITY_TEXTS.title}
    >
      <h2 className="text-lg font-bold">{VISIBILITY_TEXTS.title}</h2>
      <p className="mb-4 text-gray-600">{VISIBILITY_TEXTS.description}</p>

      <Option
        label={VISIBILITY_TEXTS.public.label}
        description={VISIBILITY_TEXTS.public.description}
        isSelected={selected === 'public'}
        onClick={() => onSelect('public')}
        aria-checked={selected === 'public'}
      />

      <Option
        label={VISIBILITY_TEXTS.private.label}
        description={VISIBILITY_TEXTS.private.description}
        isSelected={selected === 'private'}
        onClick={() => onSelect('private')}
        aria-checked={selected === 'private'}
      />
    </div>
  );
};

export default VisibilitySelector;
