import { BaseMap, CreateMapType } from '@/types';
import ImageUploader from './ImageUploader';
import TextInputArea from '../common/TextInputArea';
import VisibilitySelector from './VisibilitySelector';
import Box from '../common/Box';

type FormWrapperProps = {
  header: string;
  mapInfo: BaseMap;
  updateMapInfo: <K extends keyof BaseMap>(field: K, value: BaseMap[K]) => void;
  isMapInfoValid: boolean;
  onSubmitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
};

const FormWrapper = ({
  header,
  mapInfo,
  updateMapInfo,
  isMapInfoValid,
  onSubmitHandler,
}: FormWrapperProps) => {
  const { title, description, isPublic, mode, thumbnailUrl } = mapInfo;

  return (
    <div className="h-full">
      <h2 className="p-4 text-xl font-semibold">{header}</h2>
      <div className="flex h-[200px] gap-4 p-4">
        <ImageUploader />
        <select
          value={mode}
          onChange={(e) =>
            updateMapInfo('mode', e.target.value as CreateMapType)
          }
          className="h-[41px] w-[144px] rounded border px-3 py-2"
        >
          <option value="map">지도</option>
          <option value="course">코스</option>
        </select>
      </div>

      <form
        className="flex flex-col gap-4 bg-gray-100"
        onSubmit={onSubmitHandler}
      >
        <Box>
          <TextInputArea
            value={title}
            onChange={(prev) => updateMapInfo('title', prev)}
            placeholder={'새 지도명을 입력해주세요.'}
            maxLength={20}
            height={28}
            isTextArea={false}
          />
          <p>지도 소개</p>
          <TextInputArea
            value={description}
            onChange={(prev) => updateMapInfo('description', prev)}
            placeholder={'지도 소개를 입력해주세요.'}
            maxLength={150}
            height={160}
            isTextArea={true}
          />
        </Box>

        <Box>
          <VisibilitySelector
            selected={isPublic ? 'public' : 'private'}
            onSelect={(selected) =>
              updateMapInfo('isPublic', selected === 'public')
            }
          />
        </Box>
        <button
          type="submit"
          className={`w-full rounded text-white ${isMapInfoValid ? 'bg-c_bg_blue' : 'bg-gray-400'}`}
          disabled={!isMapInfoValid}
        >
          완료
        </button>
      </form>
    </div>
  );
};

export default FormWrapper;
