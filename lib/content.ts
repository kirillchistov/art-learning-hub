import type { Course, CourseMeta } from './types';
import modernArt from '@/content/courses/modern-art.json';
import izi from '@/content/courses/izi.json';
import russianArt from '@/content/courses/russian-art.json';
import easternArt from '@/content/courses/eastern-art.json';
import gothicArchitecture from '@/content/courses/gothic-architecture.json';
import renaissanceArchitecture from '@/content/courses/renaissance-architecture.json';
import sovietArchitecture from '@/content/courses/soviet-architecture.json';
import ancientRussianArchitecture from '@/content/courses/ancient-russian-architecture.json';
import expertView from '@/content/courses/expert-view.json';

const courses: Course[] = [
  modernArt as Course,
  izi as Course,
  russianArt as Course,
  easternArt as Course,
  gothicArchitecture as Course,
  renaissanceArchitecture as Course,
  sovietArchitecture as Course,
  ancientRussianArchitecture as Course,
  expertView as Course,
];

export function getAllCourses(): CourseMeta[] {
  return courses.map((course) => ({
    slug: course.slug,
    title: course.title,
    shortTitle: course.shortTitle,
    description: course.description,
    status: course.status,
    lessonCount: course.lessons.length,
    accent: course.accent,
  }));
}

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function getActiveCourses(): CourseMeta[] {
  return getAllCourses().filter((course) => course.status === 'active');
}
