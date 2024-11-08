import { BaseMapType, CreateMapType } from '@/types';
import { useState } from 'react';
import ImageUploader from './ImageUploader';

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
    initialData?.thumbnailUrl || '',
  );
  const [isPublic, setIsPublic] = useState(initialData?.isPublic || false);
  const [mode, setMode] = useState<CreateMapType>('MAP');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitHandler({ title, description, isPublic });
  };

  const navigateByMode = (mode: CreateMapType) => {};

  return (
    <div className="form-container rounded bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">{header}</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as CreateMapType)}
          className="w-full rounded border px-3 py-2"
        >
          <option value="map">Map</option>
          <option value="course">Course</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <ImageUploader />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Visibility:</label>
          <select
            value={isPublic ? 'public' : 'private'}
            onChange={(e) => setIsPublic(e.target.value === 'public')}
            className="w-full rounded border px-3 py-2"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormWrapper;
