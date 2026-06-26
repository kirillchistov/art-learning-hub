import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { LessonGrid } from '@/components/LessonGrid';
import { Quiz } from '@/components/Quiz';
import { getCourse } from '@/lib/content';

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourse(slug);

  if (!course || course.status !== 'active') {
    notFound();
  }

  const subtitle = `${course.shortTitle} · ${course.lessons.length} уроков`;

  return (
    <>
      <SiteHeader subtitle={subtitle} courseSlug={course.slug} />
      <main>
        <section className="hero">
          <h1>{course.heroTitle}</h1>
          <p>{course.description}</p>
        </section>

        <LessonGrid lessons={course.lessons} />

        {course.quiz && course.quiz.length > 0 ? (
          <Quiz questions={course.quiz} />
        ) : null}

        <h2 className="section-title" id="homework">
          Сводка по домашним заданиям
        </h2>
        <section className="card">
          <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: 14 }}>
            К каждому уроку прилагается домашнее задание и его авторский разбор.
            Перейти к материалам можно прямо из карточек уроков.
          </p>
          <div className="chips">
            <a className="chip" href="#lessons">
              Все уроки и ДЗ
            </a>
          </div>
        </section>

        {course.library && course.library.length > 0 ? (
          <>
            <h2 className="section-title" id="library">
              Библиотека и дополнительные ресурсы
            </h2>
            <section className="twocol">
              {course.library.map((block) => (
                <div className="card" key={block.title}>
                  <h3 style={{ marginTop: 0 }}>{block.title}</h3>
                  <ul className="refs">
                    {block.items.map((item) => (
                      <li key={item.label}>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.label}
                          </a>
                        ) : (
                          item.label
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </>
        ) : null}

        <footer className="site-footer">
          © Art Learning Hub · {course.title}
        </footer>
      </main>
    </>
  );
}
