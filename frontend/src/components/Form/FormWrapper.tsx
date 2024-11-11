import { BaseMapType, CreateMapType } from '@/types';
import { useState } from 'react';
import ImageUploader from './ImageUploader';
import TextInputArea from '../common/TextInputArea';
import VisibilitySelector from './VisibilitySelector';
import { useNavigate } from 'react-router-dom';
import Box from '../common/Box';

type FormWrapperProps = {
  header: string;
  initialData?: BaseMapType;
  onSubmitHandler: (baseMapData: BaseMapType) => Promise<string>;
};

const FormWrapper = ({
  header,
  onSubmitHandler,
  initialData,
}: FormWrapperProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnailUrl || "https://example.com/map7.jpg",
  );
  const [isPublic, setIsPublic] = useState(initialData?.isPublic || false);
  const [mode, setMode] = useState<CreateMapType>('MAP');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitHandler({ title, description, isPublic });
  };

  const navigateByMode = (mode: CreateMapType) => {
    onSubmitHandler({ title, description, isPublic,thumbnailUrl });
    if (mode === 'MAP') {
      return navigate('/map/map');
    

    } else {
      return navigate('/map/course');
    }
  };

  return (
    <div className='h-full'>
      <h2 className="p-4 text-xl font-semibold">{header}</h2>
      <div className="flex h-[200px] gap-4 p-4">
        <ImageUploader/>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as CreateMapType)}
          className="w-[144px] h-[41px] rounded border px-3 py-2"
        >
          <option value="map">지도</option>
          <option value="course">코스</option>
        </select>
      </div>

      <form className='flex flex-col gap-4 bg-gray-100'>
        <Box>
        <TextInputArea 
          value={title}
          onChange={(prev)=>setTitle(prev)}
          placeholder={"새 지도명을 입력해주세요."}
          maxLength={20}
          height={28}
          isTextArea={false}
        />
        <p>지도 소개</p>
        <TextInputArea
          value={description}
          onChange={(prev)=>setDescription(prev)}
          placeholder={"지도 소개를 입력해주세요."}
          maxLength={150}
          height={160}
          isTextArea={true}
          />
        </Box>
        
        <Box>
          <VisibilitySelector selected={isPublic ? 'public' : 'private'} onSelect={(selected)=>setIsPublic(selected==='public')}/>
        </Box>
      </form>
      <Box>
        <button
          type="submit"
          className="w-full rounded bg-c_bg_blue text-white"
          onClick={()=>navigateByMode(mode)}
        >
          완료
        </button> 
      </Box>
    </div>
  );
};

export default FormWrapper;
