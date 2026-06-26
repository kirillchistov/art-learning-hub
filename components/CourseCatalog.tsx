import Link from 'next/link';
import type { CourseMeta } from '@/lib/types';

interface CourseCatalogProps {
  courses: CourseMeta[];
}

export function CourseCatalog({ courses }: CourseCatalogProps) {
  return (
    <section className="grid">
      {courses.map((course) => {
        const isActive = course.status === 'active';
        const content = (
          <>
            <div className="course-meta">
              <span className="badge">{course.shortTitle}</span>
              {isActive ? (
                <span className="badge badge-muted">
                  {course.lessonCount}{' '}
                  {course.lessonCount === 1 ? 'урок' : 'уроков'}
                </span>
              ) : (
                <span className="badge badge-muted">Скоро</span>
              )}
            </div>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </>
        );

        if (!isActive) {
          return (
            <div className="card course-card" key={course.slug} style={{ opacity: 0.65 }}>
              {content}
            </div>
          );
        }

        return (
          <Link
            href={`/course/${course.slug}`}
            className="card course-card"
            key={course.slug}
            style={{ textDecoration: 'none' }}
          >
            {content}
          </Link>
        );
      })}
    </section>
  );
}
