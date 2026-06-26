'use client';

import { useMemo, useState } from 'react';
import type { Lesson } from '@/lib/types';

interface LessonGridProps {
  lessons: Lesson[];
  placeholder?: string;
}

export function LessonGrid({ lessons, placeholder }: LessonGridProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lessons;
    return lessons.filter((lesson) => {
      const hay = [
        lesson.searchKeywords,
        lesson.title,
        lesson.summary,
        ...lesson.tags,
        ...lesson.resources.map((r) => r.label),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [lessons, query]);

  return (
    <>
      <div className="search-wrap">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            placeholder ??
            'Поиск по урокам: например, поп-арт, перформанс, минимализм...'
          }
        />
      </div>

      <h2 className="section-title" id="lessons">
        Уроки
      </h2>
      <section className="grid">
        {filtered.map((lesson) => (
          <article className="card lesson" key={lesson.number}>
            <div className="lesson-head">
              <span className="lesson-num">Урок {lesson.number}</span>
              <div className="tags">
                {lesson.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h3 className="lesson-title">{lesson.title}</h3>
            <p className="lesson-summary">{lesson.summary}</p>
            <div className="chips">
              {lesson.resources.map((resource) =>
                resource.href ? (
                  <a
                    className="chip"
                    key={`${lesson.number}-${resource.label}`}
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.label}
                  </a>
                ) : (
                  <span className="chip" key={`${lesson.number}-${resource.label}`}>
                    {resource.label}
                  </span>
                ),
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
