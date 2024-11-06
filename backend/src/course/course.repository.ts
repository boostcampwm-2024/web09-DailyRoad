import { Injectable } from '@nestjs/common';
import { ILike, DataSource } from 'typeorm';
import { SoftDeleteRepository } from '../common/SoftDeleteRepository';
import { Course } from './entity/course.entity';

@Injectable()
export class CourseRepository extends SoftDeleteRepository<Course, number> {
  constructor(private dataSource: DataSource) {
    super(Course, dataSource.createEntityManager());
  }

  findAll(page: number, pageSize: number) {
    return this.find({
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
}
