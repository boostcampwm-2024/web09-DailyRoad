import { BaseMapType } from '@/types';
import { useState } from 'react';

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitHandler({ title, description, thumbnailUrl, isPublic });
  };
  return (
    <div className="form-container rounded bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">{header}</h2>
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
          <label className="block text-gray-700">Thumbnail URL:</label>
          <input
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
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
