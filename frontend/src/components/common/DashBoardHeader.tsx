import PrevNavButton from './PrevNavButton';

type DashBoardHeaderProps = {
  title: string;
};

const DashBoardHeader = ({ title }: DashBoardHeaderProps) => {
  return (
    <header className="flex gap-2">
      <PrevNavButton />
      <h2 className="p-4 text-xl font-semibold" id="review-heading">
        {title}
      </h2>
    </header>
  );
};

export default DashBoardHeader;
