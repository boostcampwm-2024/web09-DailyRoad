import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { CreateCourseRequest } from './dto/CreateCourseRequest';
import { UpdateCourseInfoRequest } from './dto/UpdateCourseInfoRequest';
import { CourseService } from './course.service';

@Controller('/courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getCourseList(@Query('query') query?: string) {
    return await this.courseService.searchCourse(query);
  }

  @Get('/my')
  async getMyCourseList() {
    const userId = 1; // Todo. 로그인 기능 완성 후 수정
    return await this.courseService.getOwnCourses(userId);
  }

  @Get('/:id')
  async getCourseDetail(@Param('id') id: number) {
    return await this.courseService.getCourseById(id);
  }

  @Post()
  async createCourse(@Body() createCourseRequest: CreateCourseRequest) {
    const userId = 1; // Todo. 로그인 기능 완성 후 수정
    return await this.courseService.createCourse(userId, createCourseRequest);
  }

  @Delete('/:id')
  async deleteCourse(@Param('id') id: number) {
    return await this.courseService.deleteCourse(id);
  }

  @Patch('/:id/info')
  async updateCourseInfo(
    @Param('id') id: number,
    @Body() updateCourseInfoRequest: UpdateCourseInfoRequest,
  ) {
    await this.courseService.updateCourseInfo(id, updateCourseInfoRequest);
    return { id, ...updateCourseInfoRequest };
  }

  @Patch('/:id/visibility')
  async updateCourseVisibility(
    @Param('id') id: number,
    @Body('isPublic') isPublic: boolean,
  ) {
    await this.courseService.updateCourseVisibility(id, isPublic);
    return { id, isPublic };
  }
}
