import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, '../legacy/index.html'), 'utf8');

const articleRegex =
  /<article class="card lesson" data-search="([^"]*)">([\s\S]*?)<\/article>/g;

const lessons = [];
let match;

while ((match = articleRegex.exec(html)) !== null) {
  const [, searchKeywords, body] = match;
  const numMatch = body.match(/<span class="lesson-num">Урок (\d+)<\/span>/);
  const titleMatch = body.match(/<h3 class="lesson-title">([^<]+)<\/h3>/);
  const summaryMatch = body.match(/<p class="lesson-summary">([^<]+)<\/p>/);
  const tagMatches = [...body.matchAll(/<span class="tag">([^<]+)<\/span>/g)];
  const chipMatches = [
    ...body.matchAll(
      /<a class="chip" href="([^"]*)"[^>]*>([^<]+)<\/a>/g,
    ),
  ];

  lessons.push({
    number: Number(numMatch?.[1] ?? 0),
    title: titleMatch?.[1]?.trim() ?? '',
    summary: summaryMatch?.[1]?.trim() ?? '',
    tags: tagMatches.map((t) => t[1].trim()),
    searchKeywords: searchKeywords.trim(),
    resources: chipMatches.map((c) => ({
      label: c[2].trim(),
      href: c[1].replace(/&amp;/g, '&'),
      featured: c[2].includes('🌟'),
    })),
  });
}

const course = {
  slug: 'modern-art',
  title: 'Современное искусство',
  shortTitle: 'Современное искусство',
  description:
    '12 уроков от русского авангарда до contemporary art. Каждая карточка содержит лекцию, конспект, презентацию, вебинары, mindmap, домашнее задание и разбор.',
  heroTitle: 'Современное искусство — интерактивный путеводитель',
  status: 'active',
  library: [
    {
      title: 'Курс целиком',
      items: [
        {
          label: 'Папка со всеми материалами курса',
          href: 'https://drive.google.com/drive/u/0/folders/1PMhyPxjRCs91r1LtXSbUpDUWJzJlIYlP',
        },
        {
          label: 'Документ «Полезные ссылки»',
          href: 'https://docs.google.com/document/d/1hJYk885EQRSLtqqciMclfbc6JeIQuptZ/edit',
        },
        {
          label: 'Платформа лекций Op-Pop-Art',
          href: 'https://base.oppopart-lessons.ru/',
        },
      ],
    },
    {
      title: 'Рекомендуемое чтение',
      items: [
        { label: 'Розалинд Краусс — «Подлинность авангарда и другие модернистские мифы»' },
        { label: 'Борис Гройс — «Политика поэтики», «Искусство утопии»' },
        { label: 'Хэл Фостер — «Возвращение реального»' },
        { label: 'Артур Данто — «После конца искусства»' },
        { label: 'Клер Бишоп — «Искусственный ад: партиципаторное искусство»' },
      ],
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Кто считается основоположником сюрреализма?',
      options: [
        { value: 'a', label: 'Казимир Малевич' },
        { value: 'b', label: 'Андре Бретон' },
        { value: 'c', label: 'Энди Уорхол' },
      ],
      correct: 'b',
    },
    {
      id: 'q2',
      question:
        'Какое направление связано с супрематизмом и «Чёрным квадратом»?',
      options: [
        { value: 'a', label: 'Дадаизм' },
        { value: 'b', label: 'Поп-арт' },
        { value: 'c', label: 'Русский авангард' },
      ],
      correct: 'c',
    },
    {
      id: 'q3',
      question:
        'Кто автор работ «Campbell\'s Soup Cans» и портретов Мэрилин Монро?',
      options: [
        { value: 'a', label: 'Рой Лихтенштейн' },
        { value: 'b', label: 'Энди Уорхол' },
        { value: 'c', label: 'Джексон Поллок' },
      ],
      correct: 'b',
    },
    {
      id: 'q4',
      question: 'Что характерно для минимализма?',
      options: [
        {
          value: 'a',
          label: 'Сведение формы к простым геометрическим элементам',
        },
        { value: 'b', label: 'Подробная фигуративность' },
        { value: 'c', label: 'Иллюстративный нарратив' },
      ],
      correct: 'a',
    },
    {
      id: 'q5',
      question: 'Перформанс как направление — это прежде всего:',
      options: [
        { value: 'a', label: 'Живопись маслом' },
        { value: 'b', label: 'Действие/событие как произведение' },
        { value: 'c', label: 'Книжная графика' },
      ],
      correct: 'b',
    },
  ],
  lessons,
};

writeFileSync(
  join(__dirname, '../content/courses/modern-art.json'),
  JSON.stringify(course, null, 2),
  'utf8',
);

console.log(`Extracted ${lessons.length} lessons`);
