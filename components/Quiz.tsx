'use client';

import { useState } from 'react';
import type { QuizQuestion } from '@/lib/types';

interface QuizProps {
  questions: QuizQuestion[];
}

export function Quiz({ questions }: QuizProps) {
  const [result, setResult] = useState<string | null>(null);

  const submit = () => {
    let score = 0;
    for (const q of questions) {
      const selected = document.querySelector<HTMLInputElement>(
        `input[name="${q.id}"]:checked`,
      );
      if (selected?.value === q.correct) score++;
    }
    setResult(`Результат: ${score} из ${questions.length}`);
  };

  if (questions.length === 0) return null;

  return (
    <>
      <h2 className="section-title" id="exam">
        Мини-тест по курсу
      </h2>
      <section className="card">
        {questions.map((q, index) => (
          <div className="quiz-q" key={q.id}>
            <p>
              {index + 1}. {q.question}
            </p>
            {q.options.map((option) => (
              <label key={option.value}>
                <input type="radio" name={q.id} value={option.value} />
                {option.label}
              </label>
            ))}
          </div>
        ))}
        <button className="quiz-btn" type="button" onClick={submit}>
          Проверить
        </button>
        {result ? <div className="quiz-result">{result}</div> : null}
      </section>
    </>
  );
}
