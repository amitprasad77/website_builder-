export class CreateCourseDto {
  websiteId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  instructor?: string;
  price?: number;
  duration?: string;
  level?: string;
  tags?: string[];
}


