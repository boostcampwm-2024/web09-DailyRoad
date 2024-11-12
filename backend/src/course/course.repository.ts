import { Injectable } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';
import { SoftDeleteRepository } from '../common/SoftDeleteRepository';
import { Course } from './entity/course.entity';

@Injectable()
export class CourseRepository extends SoftDeleteRepository<Course, number> {
  constructor(private dataSource: DataSource) {
    super(Course, dataSource.createEntityManager());
  }

  findAll(page: number, pageSize: number) {
    return this.find({
      where: { isPublic: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  searchByTitleQuery(title: string, page: number, pageSize: number) {
    return this.find({
      where: { title: ILike(`%${title}%`), isPublic: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  findByUserId(userId: number, page: number, pageSize: number) {
    return this.find({
      where: { user: { id: userId } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  countByTitleAndIsPublic(title: string) {
    return this.count({ where: { title, isPublic: true } });
  }

  countAllPublic() {
    return this.count({ where: { isPublic: true } });
  }

  countByUserId(userId: number) {
    return this.count({ where: { user: { id: userId } } });
  }

  updateIsPublicById(id: number, isPublic: boolean) {
    return this.update(id, { isPublic });
  }

  updateInfoById(
    id: number,
    title: string,
    description: string,
    thumbnailUrl: string,
  ) {
    return this.update(id, { title, description, thumbnailUrl });
  }
}
