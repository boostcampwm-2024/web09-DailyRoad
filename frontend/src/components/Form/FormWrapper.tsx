import ImageUploader from './ImageUploader';
import VisibilitySelector from './VisibilitySelector';

import Box from '@/components/common/Box';
import TextInputArea from '@/components/common/TextInputArea';
import DashBoardHeader from '@/components/common/DashBoardHeader';

import { BaseMap, CreateMapType } from '@/types';

type FormWrapperProps = {
  header: string;
  mapInfo: BaseMap;
  updateMapInfo: <K extends keyof BaseMap>(field: K, value: BaseMap[K]) => void;
  isMapInfoValid: boolean;
  onSubmitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode?: boolean;
};

const FormWrapper = ({
  header,
  mapInfo,
  updateMapInfo,
  isMapInfoValid,
  onSubmitHandler,
  isEditMode = false,
}: FormWrapperProps) => {
  const { title, description, isPublic, mode, thumbnailUrl } = mapInfo;

  return (
    <div className="h-full bg-gray-100">
      <Box>
        <DashBoardHeader title={header} />
        <div className="flex gap-4">
          <ImageUploader thumbnailUrl={thumbnailUrl} onUpload={updateMapInfo} />
          {!isEditMode && (
            <select
              value={mode}
              onChange={(e) =>
                updateMapInfo('mode', e.target.value as CreateMapType)
              }
              className="h-[41px] w-[144px] rounded border px-3 py-2"
            >
              <option value="MAP">지도</option>
              <option value="COURSE">코스</option>
            </select>
          )}
        </div>
      </Box>

      <form
        className="flex flex-col gap-4 bg-gray-100"
        onSubmit={onSubmitHandler}
      >
        <Box>
          <p className="text-lg font-semibold">지도 제목</p>
          <TextInputArea
            value={title}
            onChange={(value) => updateMapInfo('title', value)}
            placeholder={'새 지도명을 입력해주세요.'}
            maxLength={20}
            height={40}
            isTextArea={false}
          />
          <p className="text-lg font-semibold">지도 소개</p>
          <TextInputArea
            value={description}
            onChange={(value) => updateMapInfo('description', value)}
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
        <Box className="bottom-0">
          <button
            type="submit"
            className={`h-14 w-full rounded-md ${isMapInfoValid ? 'bg-c_bg_blue' : 'bg-c_button_gray'} p-4 text-xl font-semibold text-white`}
            disabled={!isMapInfoValid}
          >
            완료
          </button>
        </Box>
      </form>
    </div>
  );
};

export default FormWrapper;
