import { BibleStudy, StickyNote, StudyTemplateType } from "@/types/bible-study";

const STORAGE_KEY_STUDIES = "bible_study_app_data_v2";
const STORAGE_KEY_CURRENT_ID = "bible_study_app_active_id_v2";

export const INITIAL_STUDY: BibleStudy = {
  id: "study-initial",
  title: "",
  passage: "",
  bibleUrl: "https://www.bible.com/bible",
  bibleMode: "builtin",
  currentBook: "Genesis",
  currentChapter: 1,
  contentHtml: "",
  stickyNotes: [],
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function loadAllStudies(): BibleStudy[] {
  if (typeof window === "undefined") return [INITIAL_STUDY];
  try {
    // Clear out old demo storage if present
    localStorage.removeItem("bible_study_app_data_v1");
    localStorage.removeItem("bible_study_app_active_id_v1");

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
    console.error("Failed to load studies from LocalStorage", e);
    return [INITIAL_STUDY];
  }
}

export function saveAllStudies(studies: BibleStudy[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_STUDIES, JSON.stringify(studies));
  } catch (e) {
    console.error("Failed to save studies to LocalStorage", e);
  }
}

export function loadActiveStudyId(): string {
  if (typeof window === "undefined") return INITIAL_STUDY.id;
  try {
    const activeId = localStorage.getItem(STORAGE_KEY_CURRENT_ID);
    return activeId || INITIAL_STUDY.id;
  } catch {
    return INITIAL_STUDY.id;
  }
}

export function saveActiveStudyId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_ID, id);
  } catch (e) {
    console.error("Failed to save active study ID", e);
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
  template: StudyTemplateType = "blank",
  book = "Genesis",
  chapter = 1,
): BibleStudy {
  const id = `study-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  let title = "";
  let passage = `${book} ${chapter}`;
  let contentHtml = "";
  const stickyNotes: StickyNote[] = [];

  if (template === "soap") {
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
  } else if (template === "inductive") {
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
  } else if (template === "contrast") {
    title = `Kingdom Contrast: ${book} ${chapter}`;
    passage = `${book} ${chapter}`;
    contentHtml = `
      <h1>Kingdom Contrast: ${book} ${chapter}</h1>
      <p><em>Examining the contrast between counterfeit religion/culture and God’s heart.</em></p>
      <hr />
      <h2>What Counterfeit / Flesh Looks Like</h2>
      <ul>
        <li>
          <p><strong>External Performance &amp; Ritual</strong></p>
          <p><strong>Bible verses:</strong> </p>
          <p><strong>Note:</strong> How religion can become self-serving or manipulative.</p>
        </li>
      </ul>
      <h2>What God Truly Desires (Kingdom Reality)</h2>
      <ul>
        <li>
          <p><strong>Heart Sincerity &amp; Compassion</strong></p>
          <p><strong>Bible verses:</strong> </p>
          <p><strong>Note:</strong> What God values when nobody is watching.</p>
        </li>
      </ul>
      <h2>Key Memory Verse</h2>
      <blockquote>
        <p>"Is not this the kind of fasting I have chosen: to loose the chains of injustice..."</p>
      </blockquote>
      <h2>Personal Heart Examination</h2>
      <ul>
        <li><p>Where am I slipping into routine or performance?</p></li>
        <li><p>One concrete, hidden act of obedience this week:</p></li>
      </ul>
    `;
    stickyNotes.push(
      {
        id: `sn-${Date.now()}-1`,
        content: "Where in my life am I settling for ritual instead of relationship?",
        color: "yellow",
        createdAt: now,
      },
      {
        id: `sn-${Date.now()}-2`,
        content: "One concrete step of quiet obedience or mercy to take this week.",
        color: "mint",
        createdAt: now,
      }
    );
  } else if (template === "character") {
    title = `Character Deep-Dive: ${book} ${chapter}`;
    passage = `${book} ${chapter}`;
    contentHtml = `
      <h1>Character Deep-Dive: ${book} ${chapter}</h1>
      <p><em>Stepping into the biblical narrative to observe human nature and God's providence.</em></p>
      <hr />
      <h2>1. Context &amp; Life Season</h2>
      <p>Who is this person? What cultural pressures, trials, or callings were they navigating?</p>
      <h2>2. Defining Choices &amp; Flaws</h2>
      <ul>
        <li><p><strong>The pivotal test:</strong> What dilemma or opportunity did they face?</p></li>
        <li><p><strong>Faith or Fear:</strong> How did their heart respond?</p></li>
      </ul>
      <h2>3. Where God Stepped In</h2>
      <p>How did God's mercy, sovereignty, or correction show up in their story?</p>
      <h2>4. The Mirror Check</h2>
      <ul>
        <li><p>How does their struggle reflect my own tendencies?</p></li>
        <li><p>What promise about God's character anchors me today?</p></li>
      </ul>
    `;
    stickyNotes.push(
      {
        id: `sn-${Date.now()}-1`,
        content: "Mirror Check: Where do I see their weakness or fear in my own life?",
        color: "peach",
        createdAt: now,
      },
      {
        id: `sn-${Date.now()}-2`,
        content: "God's Grace: How did God prove faithful despite their shortcomings?",
        color: "lavender",
        createdAt: now,
      }
    );
  }

  const newStudy: BibleStudy = {
    id,
    title,
    passage,
    bibleUrl: "https://www.bible.com/bible",
    bibleMode: "builtin",
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
    const valid = parsed.every(
      (item) => item.id && typeof item.contentHtml === "string",
    );
    if (!valid) return false;
    saveAllStudies(parsed);
    saveActiveStudyId(parsed[0].id);
    return true;
  } catch (err) {
    console.error("Failed to parse imported JSON", err);
    return false;
  }
}
