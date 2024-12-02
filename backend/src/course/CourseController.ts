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
import { CreateCourseRequest } from '@src/course/dto/CreateCourseRequest';
import { UpdateCourseInfoRequest } from '@src/course/dto/UpdateCourseInfoRequest';
import { CourseService } from '@src/course/CourseService';
import { UpdatePinsOfCourseRequest } from '@src/course/dto/AddPlaceToCourseRequest';
import { CoursePermissionGuard } from '@src/course/guards/CoursePermissionGuard';
import { UpdatePinInCourseRequest } from '@src/course/dto/UpdatePinInCourseRequest';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';
import { AuthUser } from '@src/auth/decortator/AuthUser';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';
import { EmptyRequestException } from '@src/common/exception/EmptyRequestException';
import { UpdateCourseVisibilityRequest } from '@src/course/dto/UpdateCourseVisibilityRequest';

@Controller('/courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getCourses(
    @Query('query') query?: string,
    @Query('page', new ParseOptionalNumberPipe(1)) page?: number,
    @Query('limit', new ParseOptionalNumberPipe(15)) limit?: number,
  ) {
    return await this.courseService.searchPublicCourses(query, page, limit);
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyCourses(@AuthUser() user: AuthUser) {
    return await this.courseService.getMyCourses(user.userId);
  }

  @Get('/:id')
  async getCourseDetail(@Param('id') id: number) {
    return await this.courseService.getCourse(id);
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
  async updatePinsOfCourse(
    @Param('id') id: number,
    @Body() updatePinsOfCourseRequest: UpdatePinsOfCourseRequest,
  ) {
    return await this.courseService.updatePins(id, updatePinsOfCourseRequest);
  }

  @Put('/:id/places/:placeId')
  @UseGuards(JwtAuthGuard, CoursePermissionGuard)
  async updatePinInCourse(
    @Param('id') id: number,
    @Param('placeId') placeId: number,
    @Body() updatePinInCourseRequest: UpdatePinInCourseRequest,
  ) {
    const { comment } = updatePinInCourseRequest;
    if (updatePinInCourseRequest.isEmpty()) {
      throw new EmptyRequestException();
    }

    await this.courseService.updatePin(id, placeId, comment);

    return { courseId: id, placeId: placeId, comment: comment };
  }

  @Patch('/:id/info')
  @UseGuards(JwtAuthGuard, CoursePermissionGuard)
  async updateCourseInfo(
    @Param('id') id: number,
    @Body() updateCourseInfoRequest: UpdateCourseInfoRequest,
  ) {
    if (updateCourseInfoRequest.isEmpty()) {
      throw new EmptyRequestException();
    }

    await this.courseService.updateInfo(id, updateCourseInfoRequest);
    return { id, ...updateCourseInfoRequest };
  }

  @Patch('/:id/visibility')
  @UseGuards(JwtAuthGuard, CoursePermissionGuard)
  async updateCourseVisibility(
    @Param('id') id: number,
    @Body('isPublic')
    updateCourseVisibilityRequest: UpdateCourseVisibilityRequest,
  ) {
    await this.courseService.updateVisibility(
      id,
      updateCourseVisibilityRequest,
    );
    return { id, isPublic: updateCourseVisibilityRequest };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, CoursePermissionGuard)
  async deleteCourse(@Param('id') id: number) {
    return await this.courseService.deleteCourse(id);
  }
}
