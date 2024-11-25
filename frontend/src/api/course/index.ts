import { BaseMap, Course, CourseList } from '@/types';
import { axiosInstance } from '../axiosInstance';
import { END_POINTS } from '@/constants/api';

type CourseResponse = {
  id: number;
};

type EditInfoResponse = {
  id: number;
  title: string;
  description: string;
};

type EditVisiviltyResponse = {
  id: number;
  isPublic: boolean;
};

export const createCourse = async (baseCourseData: Omit<BaseMap, 'mode'>) => {
  const { data } = await axiosInstance.post<CourseResponse>(
    END_POINTS.COURSES,
    baseCourseData,
  );
  return data.id;
};

export const getCourse = async (courseId: number) => {
  const { data } = await axiosInstance.get<Course>(
    END_POINTS.COURSE(courseId),
    { useAuth: false },
  );
  return data;
};

export const getCourseList = async (pageParam: number) => {
  const { data } = await axiosInstance.get<CourseList>(END_POINTS.COURSES, {
    params: {
      page: pageParam,
    },
    useAuth: false,
  });
  return data;
};

export const getMyCourseList = async () => {
  const { data } = await axiosInstance.get<CourseList>(END_POINTS.MY_COURSE);
  return data;
};

export const editCourseInfo = async ({
  title,
  description,
  courseId,
}: {
  title: string;
  description: string;
  courseId: number;
}) => {
  const { data } = await axiosInstance.patch<EditInfoResponse>(
    END_POINTS.EDIT_COURSE_INFO(courseId),
    {
      title,
      description,
    },
  );
  return data;
};

export const editCourseVisibility = async ({
  courseId,
  isPublic,
}: {
  courseId: number;
  isPublic: boolean;
}) => {
  const { data } = await axiosInstance.patch<EditVisiviltyResponse>(
    END_POINTS.EDIT_COURSE_VISIBILITY(courseId),
    {
      isPublic,
    },
  );
  return data;
};

export const editCourse = async (data: BaseMap & { courseId: number }) => {
  const [infoResponse, visibilityResponse] = await Promise.all([
    editCourseInfo({
      title: data.title,
      description: data.description,
      courseId: data.courseId,
    }),
    editCourseVisibility({ courseId: data.courseId, isPublic: data.isPublic }),
  ]);
  return { ...infoResponse, ...visibilityResponse };
};

export const deleteCourse = async (CourseId: number) => {
  const { data } = await axiosInstance.delete(END_POINTS.COURSE(CourseId));
  return data;
};
