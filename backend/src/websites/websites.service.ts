import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWebsiteDto } from './dto/create-website.dto';

@Injectable()
export class WebsitesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWebsiteDto) {
    return this.prisma.website.create({ data: dto });
  }

  async findAll() {
    return this.prisma.website.findMany({
      include: { template: true, course: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const website = await this.prisma.website.findUnique({
      where: { id },
      include: { template: true, course: { include: { lessons: { orderBy: { order: 'asc' } } } }, pages: true },
    });
    if (!website) throw new NotFoundException(`Website ${id} not found`);
    return website;
  }

  async findBySlug(slug: string) {
    const website = await this.prisma.website.findUnique({
      where: { slug },
      include: { template: true, course: { include: { lessons: { orderBy: { order: 'asc' } } } }, pages: true },
    });
    if (!website) throw new NotFoundException(`Website with slug "${slug}" not found`);
    // Inject course data into template layout
    const layout = this.injectDataIntoLayout(website.template.layout, website.course);
    return { ...website, mergedLayout: layout };
  }

  async publish(id: string) {
    await this.findOne(id);
    return this.prisma.website.update({ where: { id }, data: { status: 'PUBLISHED' } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.website.delete({ where: { id } });
  }

  private injectDataIntoLayout(layout: any, course: any): any {
    if (!course) return layout;
    const str = JSON.stringify(layout);
    const replaced = str
      .replace(/\{\{course\.title\}\}/g, course.title || '')
      .replace(/\{\{course\.description\}\}/g, course.description || '')
      .replace(/\{\{course\.instructor\}\}/g, course.instructor || '')
      .replace(/\{\{course\.thumbnail\}\}/g, course.thumbnail || '')
      .replace(/\{\{course\.price\}\}/g, course.price?.toString() || '')
      .replace(/\{\{course\.duration\}\}/g, course.duration || '')
      .replace(/\{\{course\.level\}\}/g, course.level || '');
    return JSON.parse(replaced);
  }
}