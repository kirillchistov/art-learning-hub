'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('alh-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  return <>{children}</>;
}

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('alh-theme', next);
  };

  return (
    <button className="theme-btn" type="button" onClick={toggle} aria-label="Переключить тему">
      Тема
    </button>
  );
}
