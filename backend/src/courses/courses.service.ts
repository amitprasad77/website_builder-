import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({ data: dto });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: { lessons: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    return course;
  }

  async update(id: string, dto: Partial<CreateCourseDto>) {
    await this.findOne(id);
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async addLesson(courseId: string, dto: CreateLessonDto) {
    await this.findOne(courseId);
    return this.prisma.lesson.create({ data: { ...dto, courseId } });
  }

  async removeLesson(lessonId: string) {
    return this.prisma.lesson.delete({ where: { id: lessonId } });
  }
}