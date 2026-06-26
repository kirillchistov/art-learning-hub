import { notFound } from 'next/navigation';
import { getAllCourses } from '@/lib/content';

export function generateStaticParams() {
  return getAllCourses()
    .filter((course) => course.status === 'active')
    .map((course) => ({ slug: course.slug }));
}

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getAllCourses().find((item) => item.slug === slug);
  if (!course) notFound();
  return { title: `${course.title} · Art Learning Hub` };
}
