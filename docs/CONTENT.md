# Управление контентом и ссылками

Art Learning Hub хранит **метаданные и ссылки** в git, а **файлы материалов** — на Google Drive.

## Принцип

| Что | Где хранится |
|-----|-------------|
| Структура курса, уроки, теги | `content/courses/*.json` → git |
| PDF, презентации, видео, mindmap | Google Drive → только ссылки в JSON |
| Локальные копии (для работы офлайн) | `materials/` или `СИ_урок_*/` → **не в git** |

Лимит GitHub: **100 МБ на файл**, рекомендуется < 50 МБ. Поэтому бинарники в репозиторий не добавляем.

---

## Добавить или заменить ссылку на материал

1. Загрузите файл на Google Drive (в папку курса).
2. ПКМ по файлу → **«Настроить доступ»** → «Все, у у кого есть ссылка» (достаточно для учебных материалов в закрытом hub).
3. Скопируйте ссылку.
4. Откройте нужный JSON, например `content/courses/modern-art.json`.
5. В массиве `resources` нужного урока добавьте или измените объект:

```json
{
  "label": "Конспект",
  "href": "https://drive.google.com/file/d/ВАШ_FILE_ID/view?usp=drive_link"
}
```

6. Закоммитьте только JSON:

```bash
git add content/courses/modern-art.json
git commit -m "Update lesson 5 presentation link"
git push
```

### Форматы ссылок Google Drive

| Тип | Пример URL |
|-----|-----------|
| Файл | `https://drive.google.com/file/d/FILE_ID/view?usp=drive_link` |
| Папка | `https://drive.google.com/drive/folders/FOLDER_ID` |
| Google Docs/Slides | `https://docs.google.com/presentation/d/FILE_ID/edit?usp=sharing` |

---

## Добавить новый урок

В `content/courses/<course>.json` добавьте объект в массив `lessons`:

```json
{
  "number": 2,
  "title": "Название урока",
  "summary": "Краткое описание",
  "tags": ["тег1", "тег2"],
  "searchKeywords": "урок 2 ключевые слова для поиска",
  "resources": [
    { "label": "Лекция", "href": "https://..." },
    { "label": "Конспект", "href": "https://..." },
    { "label": "Презентация", "href": "https://..." },
    { "label": "ДЗ", "href": "https://..." },
    { "label": "Решение 🌟", "href": "https://...", "featured": true }
  ]
}
```

Поле `featured: true` — для выделения разбора ДЗ (необязательно).

---

## Добавить новый раздел (курс)

1. Создайте `content/courses/my-course.json` по образцу `modern-art.json` или `izi.json`.
2. Зарегистрируйте в `lib/content.ts` (импорт + добавление в массив `courses`).
3. Установите `"status": "active"`, когда материалы готовы; `"coming-soon"` — для заглушки на главной.

---

## Перенос материалов с локального диска на Drive

Если файлы лежат локально (например, в `СИ_урок_12/`):

1. Создайте на Drive папку курса / урока.
2. Загрузите файлы через веб-интерфейс или [Google Drive for Desktop](https://www.google.com/drive/download/).
3. Для каждого файла получите ссылку и пропишите в JSON (см. выше).
4. Локальные файлы можно оставить на диске — git их игнорирует.

### Пакетная загрузка (опционально)

```bash
# Пример: скопировать локальные папки в materials/ для порядка
mkdir -p materials/modern-art
cp -R "СИ_урок_1" materials/modern-art/урок-01
```

Затем загрузите `materials/modern-art/` на Drive вручную или через клиент.

---

## Перегенерация modern-art из legacy HTML

Если обновили `legacy/index.html`:

```bash
npm run extract-content
```

Скрипт перезапишет `content/courses/modern-art.json` ссылками из HTML. Проверьте diff перед коммитом.

---

## Что не коммитить

Следующее игнорируется `.gitignore`:

- `СИ_урок_*/` — локальные папки уроков
- `materials/` — организованное локальное хранилище
- `*.pdf`, `*.docx`, `*.pages`, изображения, видео

Если git снова «видит» большие файлы:

```bash
git rm -r --cached "СИ_урок_"*   # убрать из индекса, не удаляя с диска
git status
git commit -m "Stop tracking local material files"
```

---

## Папки курсов на Google Drive

| Курс | Папка |
|------|-------|
| Современное искусство | [Drive folder](https://drive.google.com/drive/u/0/folders/1PMhyPxjRCs91r1LtXSbUpDUWJzJlIYlP) |
| ИЗИ | [Drive folder](https://drive.google.com/drive/folders/1VZPK9LAKMbxoHo1jLTEnlWcbZ1HXvNfr) |

Обновляйте эту таблицу в JSON-файлах курсов (`library` → `items`).
