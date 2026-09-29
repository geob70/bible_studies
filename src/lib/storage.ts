import { BibleStudy, StickyNote } from '@/types/bible-study';

const STORAGE_KEY_STUDIES = 'bible_study_app_data_v2';
const STORAGE_KEY_CURRENT_ID = 'bible_study_app_active_id_v2';

export const INITIAL_STUDY: BibleStudy = {
  id: 'study-initial',
  title: '',
  passage: '',
  bibleUrl: 'https://bolls.life',
  bibleMode: 'builtin',
  currentBook: 'Genesis',
  currentChapter: 1,
  contentHtml: '',
  stickyNotes: [],
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function loadAllStudies(): BibleStudy[] {
  if (typeof window === 'undefined') return [INITIAL_STUDY];
  try {
    // Clear out old demo storage if present
    localStorage.removeItem('bible_study_app_data_v1');
    localStorage.removeItem('bible_study_app_active_id_v1');

    const raw = localStorage.getItem(STORAGE_KEY_STUDIES);
    if (!raw) {
      saveAllStudies([INITIAL_STUDY]);
      return [INITIAL_STUDY];
    }
    const studies = JSON.parse(raw) as BibleStudy[];
    if (!Array.isArray(studies) || studies.length === 0) {
      saveAllStudies([INITIAL_STUDY]);
      return [INITIAL_STUDY];
    }
    return studies;
  } catch (e) {
    console.error('Failed to load studies from LocalStorage', e);
    return [INITIAL_STUDY];
  }
}

export function saveAllStudies(studies: BibleStudy[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_STUDIES, JSON.stringify(studies));
  } catch (e) {
    console.error('Failed to save studies to LocalStorage', e);
  }
}

export function loadActiveStudyId(): string {
  if (typeof window === 'undefined') return INITIAL_STUDY.id;
  try {
    const activeId = localStorage.getItem(STORAGE_KEY_CURRENT_ID);
    return activeId || INITIAL_STUDY.id;
  } catch {
    return INITIAL_STUDY.id;
  }
}

export function saveActiveStudyId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_ID, id);
  } catch (e) {
    console.error('Failed to save active study ID', e);
  }
}

export function saveStudy(study: BibleStudy): void {
  const current = loadAllStudies();
  const index = current.findIndex((s) => s.id === study.id);
  const updatedStudy = {
    ...study,
    updatedAt: new Date().toISOString(),
  };

  let updatedList: BibleStudy[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = updatedStudy;
  } else {
    updatedList = [updatedStudy, ...current];
  }

  saveAllStudies(updatedList);
  saveActiveStudyId(updatedStudy.id);
}

export function deleteStudy(id: string): BibleStudy[] {
  const current = loadAllStudies();
  const filtered = current.filter((s) => s.id !== id);
  const finalList = filtered.length > 0 ? filtered : [INITIAL_STUDY];
  saveAllStudies(finalList);
  return finalList;
}

export function createNewStudy(
  template: 'blank' | 'soap' | 'inductive' = 'blank',
  book = 'Genesis',
  chapter = 1
): BibleStudy {
  const id = `study-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  let title = '';
  let passage = `${book} ${chapter}`;
  let contentHtml = '';
  let stickyNotes: StickyNote[] = [];

  if (template === 'soap') {
    title = `SOAP Study: ${book} ${chapter}`;
    passage = `${book} ${chapter}`;
    contentHtml = `
      <h1>SOAP Study: ${book} ${chapter}</h1>
      <h2>Scripture</h2>
      <p></p>
      <h2>Observation</h2>
      <p></p>
      <h2>Application</h2>
      <p></p>
      <h2>Prayer</h2>
      <p></p>
    `;
  } else if (template === 'inductive') {
    title = `Inductive Study: ${book} ${chapter}`;
    passage = `${book} ${chapter}`;
    contentHtml = `
      <h1>Inductive Study: ${book} ${chapter}</h1>
      <h2>1. Observation</h2>
      <p></p>
      <h2>2. Interpretation</h2>
      <p></p>
      <h2>3. Correlation</h2>
      <p></p>
      <h2>4. Application</h2>
      <p></p>
    `;
  }

  const newStudy: BibleStudy = {
    id,
    title,
    passage,
    bibleUrl: 'https://bolls.life',
    bibleMode: 'builtin',
    currentBook: book,
    currentChapter: chapter,
    contentHtml,
    stickyNotes,
    tags: [],
    createdAt: now,
    updatedAt: now,
  };

  saveStudy(newStudy);
  return newStudy;
}

export function exportStudiesToJson(): string {
  const studies = loadAllStudies();
  return JSON.stringify(studies, null, 2);
}

export function importStudiesFromJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed) || parsed.length === 0) return false;
    const valid = parsed.every((item) => item.id && typeof item.contentHtml === 'string');
    if (!valid) return false;
    saveAllStudies(parsed);
    saveActiveStudyId(parsed[0].id);
    return true;
  } catch (err) {
    console.error('Failed to parse imported JSON', err);
    return false;
  }
}
