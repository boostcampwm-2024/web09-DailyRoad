import React from 'react';
import { useNavigate } from 'react-router-dom';

import BaseWrapper from '@/components/common/BaseWrapper';
import FormWrapper from './FormWrapper';

import { useEditCourseMutation } from '@/hooks/api/useEditCourseMutation';
import { useMapForm } from '@/hooks/useMapForm';
import { useStore } from '@/store/useStore';
import { BaseMap, Course } from '@/types';

type EditCourseFormProps = {
  courseData: Course;
};

const EditCourseForm = ({ courseData }: EditCourseFormProps) => {
  const editCourseMutation = useEditCourseMutation();
  const navigate = useNavigate();
  const addToast = useStore((state) => state.addToast);

  const initialCourseData: BaseMap = {
    title: courseData.title,
    description: courseData.description,
    isPublic: courseData.isPublic,
    thumbnailUrl: courseData.thumbnailUrl,
    mode: 'COURSE',
  };

  const { mapInfo, updateMapInfo, isMapInfoValid } =
    useMapForm(initialCourseData);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editCourseMutation.mutate(
      { courseId: courseData.id, ...mapInfo },
      {
        onSuccess: () => {
          addToast('코스가 수정되었습니다.', '', 'success');
          navigate(`/course/${courseData.id}`);
        },
      },
    );
  };

  return (
    <>
      <BaseWrapper position="" top="" left="" className="w-1/2">
        <FormWrapper
          header="코스 수정"
          mapInfo={mapInfo}
          updateMapInfo={updateMapInfo}
          isMapInfoValid={isMapInfoValid}
          onSubmitHandler={onSubmitHandler}
          isEditMode={true}
        />
      </BaseWrapper>
    </>
  );
};

export default EditCourseForm;
