import { BibleStudy } from '@/types/bible-study';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const EXPORT_WIDTH = 720;

// The export lives in its own document so application resets, Tailwind layers,
// animation, and viewport constraints cannot change the PDF's typography.
const EXPORT_CSS = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; color: #171717; }
  body { width: ${EXPORT_WIDTH}px; font: 16px/1.7 Arial, Helvetica, sans-serif; }
  h1, h2, h3, p, ul, ol, blockquote { margin: 0; }
  .document-header { padding: 4px 0 26px; border-bottom: 2px solid #171717; margin-bottom: 28px; }
  .eyebrow { font-size: 11px; line-height: 18px; letter-spacing: 2px; color: #666; }
  .date { font-size: 12px; line-height: 20px; color: #666; margin-top: 6px; }
  .document-title { font-size: 32px; line-height: 1.3; margin: 22px 0 16px; overflow-wrap: anywhere; }
  .passage { font-size: 15px; line-height: 24px; font-weight: bold; color: #333; }
  .tags { font-size: 12px; line-height: 20px; color: #666; margin-top: 8px; }
  .content { overflow-wrap: anywhere; }
  .content h1 { font-size: 27px; line-height: 1.35; margin: 26px 0 14px; }
  .content h2 { font-size: 23px; line-height: 1.4; margin: 24px 0 12px; }
  .content h3 { font-size: 19px; line-height: 1.5; margin: 20px 0 10px; }
  .content p { margin-bottom: 14px; min-height: 14px; }
  .content ul, .content ol { padding-left: 28px; margin-bottom: 18px; }
  .content li { margin-bottom: 6px; }
  .content li p { margin-bottom: 4px; }
  .content blockquote { border-left: 3px solid #999; padding: 12px 20px; margin: 20px 0; font-style: italic; }
  .content blockquote p:last-child { margin-bottom: 0; }
  .content mark { padding: 1px 3px; }
  .content hr { border: 0; border-top: 1px solid #ddd; margin: 24px 0; }
  .content pre { white-space: pre-wrap; font-size: 13px; }
  .content a { color: #333; text-decoration: underline; }
  .empty { color: #777; font-style: italic; }
  .reflections { margin-top: 36px; border-top: 1px solid #ccc; padding-top: 24px; }
  .reflections h2 { font-size: 21px; line-height: 30px; margin-bottom: 18px; }
  .reflection { padding: 0 0 16px; margin-bottom: 16px; border-bottom: 1px solid #ddd; }
  .reflection-label { font-size: 10px; letter-spacing: 1px; color: #777; margin-bottom: 6px; }
  .reflection-text { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 14px; }
`;

export async function exportStudyToPdf(study: BibleStudy): Promise<void> {
  const frame = document.createElement('iframe');
  frame.title = 'PDF export renderer';
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  Object.assign(frame.style, {
    position: 'fixed', left: '-10000px', top: '0',
    width: `${EXPORT_WIDTH}px`, height: '1000px', border: '0',
  });
  document.body.appendChild(frame);

  try {
    const exportDocument = frame.contentDocument;
    if (!exportDocument) throw new Error('Could not prepare the PDF document.');

    // Restrict exported HTML to the editor's supported text formatting.
    const source = new DOMParser().parseFromString(study.contentHtml, 'text/html');
    const allowed = new Set(['P', 'BR', 'H1', 'H2', 'H3', 'UL', 'OL', 'LI',
      'BLOCKQUOTE', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'STRIKE', 'SPAN', 'MARK', 'HR', 'PRE', 'CODE']);
    for (const element of Array.from(source.body.querySelectorAll('*')).reverse()) {
      if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED'].includes(element.tagName)) {
        element.remove();
      } else if (!allowed.has(element.tagName)) {
        element.replaceWith(...Array.from(element.childNodes));
      } else {
        const inlineStyle = (element as HTMLElement).style;
        const color = inlineStyle.color;
        const background = inlineStyle.backgroundColor;
        for (const attr of Array.from(element.attributes)) element.removeAttribute(attr.name);
        if (color) (element as HTMLElement).style.color = color;
        if (background) (element as HTMLElement).style.backgroundColor = background;
      }
    }

    const formattedDate = new Date(study.updatedAt || study.createdAt)
      .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const hasContent = Boolean(source.body.textContent?.trim());
    exportDocument.open();
    exportDocument.write(`<!doctype html><html><head><meta charset="utf-8"><style>${EXPORT_CSS}</style></head>
      <body>
        <header class="document-header">
          <div class="eyebrow">BIBLE STUDY NOTES</div>
          <div class="date">${escapeHtml(formattedDate)}</div>
          <h1 class="document-title">${escapeHtml(study.title || 'Untitled Bible Study')}</h1>
          ${study.passage ? `<div class="passage">${escapeHtml(study.passage)}</div>` : ''}
          ${study.tags.length ? `<div class="tags">${study.tags.map(escapeHtml).join(' &nbsp; / &nbsp; ')}</div>` : ''}
        </header>
        <main class="content">${hasContent ? source.body.innerHTML : '<p class="empty">No study notes have been added yet.</p>'}</main>
        ${study.stickyNotes.length ? `<section class="reflections"><h2>Thoughts &amp; reflections</h2>
          ${study.stickyNotes.map((note, index) => `<div class="reflection">
            <div class="reflection-label">REFLECTION ${index + 1}</div>
            <div class="reflection-text">${escapeHtml(note.content || '(Empty reflection)')}</div>
          </div>`).join('')}
        </section>` : ''}
      </body></html>`);
    exportDocument.close();
    await exportDocument.fonts.ready;
    const body = exportDocument.body;
    frame.style.height = `${body.scrollHeight + 20}px`;

    const canvas = await html2canvas(body, {
      scale: 2, backgroundColor: '#ffffff', logging: false,
      width: EXPORT_WIDTH, height: body.scrollHeight,
      windowWidth: EXPORT_WIDTH, windowHeight: body.scrollHeight,
      scrollX: 0, scrollY: 0,
    });
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margin = 18;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    const pixelsPerMm = canvas.width / contentWidth;
    const maxSliceHeight = Math.floor((pageHeight - margin * 2 - 10) * pixelsPerMm);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not render the PDF pages.');

    let offset = 0;
    while (offset < canvas.height) {
      let end = Math.min(offset + maxSliceHeight, canvas.height);
      if (end < canvas.height) {
        // Find whitespace near the page boundary so a line is never sliced
        // merely because it happened to fall on the physical page edge.
        const scanStart = Math.max(offset + 1, end - Math.round(90 * 2));
        const strip = context.getImageData(0, scanStart, canvas.width, end - scanStart);
        for (let row = strip.height - 1; row >= 0; row--) {
          let blank = true;
          for (let x = 0; x < strip.width; x++) {
            const i = (row * strip.width + x) * 4;
            if (strip.data[i] < 245 || strip.data[i + 1] < 245 || strip.data[i + 2] < 245) {
              blank = false;
              break;
            }
          }
          if (blank) { end = scanStart + row + 1; break; }
        }
      }
      const slice = document.createElement('canvas');
      slice.width = canvas.width;
      slice.height = end - offset;
      const sliceContext = slice.getContext('2d');
      if (!sliceContext) throw new Error('Could not compose a PDF page.');
      sliceContext.drawImage(canvas, 0, offset, canvas.width, slice.height,
        0, 0, slice.width, slice.height);
      if (offset > 0) pdf.addPage();
      pdf.addImage(slice.toDataURL('image/png'), 'PNG', margin, margin,
        contentWidth, slice.height / pixelsPerMm);
      offset = end;
    }

    const pageCount = pdf.getNumberOfPages();
    for (let page = 1; page <= pageCount; page++) {
      pdf.setPage(page);
      pdf.setDrawColor(220);
      pdf.line(margin, pageHeight - 17, pageWidth - margin, pageHeight - 17);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(120);
      pdf.text('SELAH / BIBLE STUDY', margin, pageHeight - 11);
      pdf.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 11, { align: 'right' });
    }
    const safeTitle = (study.title || 'bible-study').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50) || 'bible-study';
    pdf.save(`${safeTitle}.pdf`);
  } finally {
    frame.remove();
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
