import Link from 'next/link';
import { ThemeToggle } from './ThemeProvider';
import { LogoutButton } from './LogoutButton';

interface SiteHeaderProps {
  subtitle?: string;
  courseSlug?: string;
}

export function SiteHeader({ subtitle, courseSlug }: SiteHeaderProps) {
  return (
    <header className="site">
      <div className="nav">
        <Link href="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="brand-name">Art Learning Hub</span>
          <span className="brand-sub">{subtitle ?? 'Образовательный портал'}</span>
        </Link>
        <nav className="nav-links">
          {courseSlug ? (
            <>
              <Link href={`/course/${courseSlug}#lessons`}>Уроки</Link>
              <Link href={`/course/${courseSlug}#exam`}>Тест</Link>
              <Link href={`/course/${courseSlug}#library`}>Библиотека</Link>
            </>
          ) : null}
          <Link href="/">Разделы</Link>
          <ThemeToggle />
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
