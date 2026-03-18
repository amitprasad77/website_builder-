import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateCourseDto>) {
    return this.service.update(id, dto);
  }

  @Post(':id/lessons')
  addLesson(@Param('id') id: string, @Body() dto: CreateLessonDto) {
    return this.service.addLesson(id, dto);
  }

  @Delete('lessons/:lessonId')
  @HttpCode(204)
  removeLesson(@Param('lessonId') lessonId: string) {
    return this.service.removeLesson(lessonId);
  }
}