import { SiteHeader } from '@/components/SiteHeader';
import { CourseCatalog } from '@/components/CourseCatalog';
import { getAllCourses } from '@/lib/content';

export default function HomePage() {
  const courses = getAllCourses();

  return (
    <>
      <SiteHeader subtitle="Все разделы" />
      <main>
        <section className="hero">
          <h1>Art Learning Hub</h1>
          <p>
            Интерактивные путеводители по истории искусства: уроки, материалы,
            тесты и ссылки на Google Drive.
          </p>
        </section>

        <h2 className="section-title">Разделы</h2>
        <CourseCatalog courses={courses} />

        <footer className="site-footer">
          © Art Learning Hub · Образовательный портал
        </footer>
      </main>
    </>
  );
}
