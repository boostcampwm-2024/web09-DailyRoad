import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCourseRequest } from './dto/CreateCourseRequest';
import { UpdateCourseInfoRequest } from './dto/UpdateCourseInfoRequest';
import { CourseService } from './course.service';
import { SetPlacesOfCourseRequest } from './dto/AddPlaceToCourseRequest';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { AuthUser } from '../auth/AuthUser.decorator';
import { CoursePermissionGuard } from './guards/CoursePermissionGuard';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';

@Controller('/courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getCourseList(
    @Query('query') query?: string,
    @Query('page', new ParseOptionalNumberPipe(1)) page?: number,
    @Query('limit', new ParseOptionalNumberPipe(10)) limit?: number,
  ) {
    return await this.courseService.searchPublicCourses(query, page, limit);
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyCourseList(@AuthUser() user: AuthUser) {
    return await this.courseService.getOwnCourses(user.userId);
  }

  @Get('/:id')
  async getCourseDetail(@Param('id') id: number) {
    return await this.courseService.getCourseById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCourse(
    @AuthUser() user: AuthUser,
    @Body() createCourseRequest: CreateCourseRequest,
  ) {
    return await this.courseService.createCourse(
      user.userId,
      createCourseRequest,
    );
  }

  @Put('/:id/places')
  @UseGuards(JwtAuthGuard, CoursePermissionGuard)
  async setPlacesOfCourse(
    @Param('id') id: number,
    @Body() setPlacesOfCourseRequest: SetPlacesOfCourseRequest,
  ) {
    return await this.courseService.setPlacesOfCourse(
      id,
      setPlacesOfCourseRequest,
    );
  }

  @Patch('/:id/info')
  @UseGuards(JwtAuthGuard, CoursePermissionGuard)
  async updateCourseInfo(
    @Param('id') id: number,
    @Body() updateCourseInfoRequest: UpdateCourseInfoRequest,
  ) {
    await this.courseService.updateCourseInfo(id, updateCourseInfoRequest);
    return { id, ...updateCourseInfoRequest };
  }

  @Patch('/:id/visibility')
  @UseGuards(JwtAuthGuard, CoursePermissionGuard)
  async updateCourseVisibility(
    @Param('id') id: number,
    @Body('isPublic') isPublic: boolean,
  ) {
    await this.courseService.updateCourseVisibility(id, isPublic);
    return { id, isPublic };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, CoursePermissionGuard)
  async deleteCourse(@Param('id') id: number) {
    return await this.courseService.deleteCourse(id);
  }
}
