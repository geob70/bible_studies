import { BibleStudy } from '@/types/bible-study';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportStudyToPdf(study: BibleStudy): Promise<void> {
  // Create an offscreen styled container specifically designed for PDF rendering
  const container = document.createElement('div');
  container.id = 'pdf-export-container';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0a0a0a';
  container.style.fontFamily = '"suisse", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  container.style.padding = '48px 56px';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.6';

  const formattedDate = new Date(study.updatedAt || study.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const stickyNotesHtml = study.stickyNotes.length > 0 ? `
    <div style="margin-top: 48px; border-top: 2px solid #0a0a0a1a; padding-top: 28px;">
      <h3 style="font-size: 18px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 16px; color: #111111;">
        Study Insights & Sticky Notes
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${study.stickyNotes.map((note) => {
          const bgColors: Record<string, { bg: string; border: string; text: string }> = {
            yellow: { bg: '#FEF9C3', border: '#FDE047', text: '#713F12' },
            mint: { bg: '#DCFCE7', border: '#86EFAC', text: '#14532D' },
            sky: { bg: '#E0F2FE', border: '#7DD3FC', text: '#0C4A6E' },
            lavender: { bg: '#F3E8FF', border: '#D8B4FE', text: '#581C87' },
            peach: { bg: '#FFEDD5', border: '#FED7AA', text: '#7C2D12' },
            rose: { bg: '#FFE4E6', border: '#FECDD3', text: '#881337' },
            slate: { bg: '#F1F5F9', border: '#CBD5E1', text: '#1E293B' },
          };
          const style = bgColors[note.color] || bgColors.yellow;
          return `
            <div style="background-color: ${style.bg}; border: 1px solid ${style.border}; color: ${style.text}; border-radius: 12px; padding: 14px; font-size: 13px; line-height: 1.5; box-sizing: border-box;">
              <div style="font-weight: 500; white-space: pre-wrap;">${escapeHtml(note.content || '(Empty note)')}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  container.innerHTML = `
    <div style="margin-bottom: 32px; border-bottom: 2px solid #111111; padding-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
        <span style="font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6b6b6b;">
          BIBLE STUDY NOTES
        </span>
        <span style="font-size: 13px; color: #6b6b6b;">${formattedDate}</span>
      </div>
      <h1 style="font-size: 28px; font-weight: 700; line-height: 1.2; margin: 0 0 10px 0; color: #0a0a0a;">
        ${escapeHtml(study.title || 'Untitled Bible Study')}
      </h1>
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        ${study.passage ? `
          <span style="background-color: #111111; color: #ffffff; padding: 4px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600;">
            ${escapeHtml(study.passage)}
          </span>
        ` : ''}
        ${study.tags.map((t) => `
          <span style="background-color: #f5f5f5; color: #6b6b6b; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; border: 1px solid #0a0a0a1a;">
            ${escapeHtml(t)}
          </span>
        `).join('')}
      </div>
    </div>

    <div class="pdf-content-body" style="font-size: 15px; color: #111111; line-height: 1.65;">
      ${study.contentHtml}
    </div>

    ${stickyNotesHtml}

    <div style="margin-top: 48px; padding-top: 16px; border-top: 1px solid #0a0a0a1a; display: flex; justify-content: space-between; font-size: 11px; color: #a1a1a1;">
      <span>Prepared with Scripture Study Workspace</span>
      <span>${escapeHtml(study.passage || '')}</span>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const safeTitle = (study.title || 'bible-study')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 30);
    pdf.save(`${safeTitle}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF canvas:', error);
    // Graceful fallback to window.print()
    window.print();
  } finally {
    document.body.removeChild(container);
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
