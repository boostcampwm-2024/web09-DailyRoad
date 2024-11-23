import { useGooglePlaceQuery } from '@/hooks/api/useGooglePlaceQuery';
import GooglePlaceItem from './GooglePlaceItem';

type SearchGoogleResultsProps = {
  query: string;
};

const SearchGoogleResults = ({ query }: SearchGoogleResultsProps) => {
  const places = useGooglePlaceQuery(query);

  return (
    <div className="max-h-[600px] flex-grow">
      {places.map((place) => (
        <GooglePlaceItem key={place.id} place={place} />
      ))}
    </div>
  );
};

export default SearchGoogleResults;
