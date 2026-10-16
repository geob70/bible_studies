import { BibleStudy, PdfTheme, StickyColor } from "@/types/bible-study";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const EXPORT_WIDTH = 780;

function getExportCss(theme: PdfTheme): string {
  if (theme === "parchment") {
    return `
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; background: #fbf7ef; color: #2e241c; }
      body { width: ${EXPORT_WIDTH}px; font: 13.5px/1.65 Georgia, Cambria, "Times New Roman", serif; }
      h1, h2, h3, p, ul, ol, blockquote { margin: 0; }
      .document-header { padding: 4px 0 20px; border-bottom: 2px double #b45309; margin-bottom: 22px; }
      .eyebrow { font-size: 10px; line-height: 16px; letter-spacing: 2.5px; color: #92400e; font-weight: bold; }
      .date { font-size: 11px; line-height: 18px; color: #78350f; margin-top: 4px; }
      .document-title { font-size: 25px; line-height: 1.25; margin: 14px 0 10px; color: #451a03; font-weight: 700; overflow-wrap: anywhere; }
      .passage { font-size: 13.5px; line-height: 20px; font-weight: 600; font-style: italic; color: #78350f; }
      .tags { font-size: 11px; line-height: 18px; color: #92400e; margin-top: 6px; }
      .content { overflow-wrap: anywhere; }
      .content h1 { font-size: 19px; line-height: 1.35; margin: 20px 0 8px; color: #451a03; border-bottom: 1px solid #e7dbca; padding-bottom: 4px; }
      .content h2 { font-size: 16px; line-height: 1.4; margin: 16px 0 6px; color: #78350f; }
      .content h3 { font-size: 14px; line-height: 1.45; margin: 14px 0 4px; color: #92400e; }
      .content p { margin-bottom: 10px; min-height: 12px; }
      .content ul, .content ol { list-style: none !important; margin: 0 0 10px 0; padding: 0 0 0 2px; }
      .content li.pdf-li { display: flex !important; align-items: flex-start !important; margin-bottom: 5px; list-style: none !important; }
      .content .pdf-li-marker { flex-shrink: 0; width: 14px; margin-right: 8px; text-align: center; line-height: 1.65; font-size: 13.5px; font-weight: 700; color: #b45309; }
      .content .pdf-li-body { flex: 1; min-width: 0; }
      .content .pdf-li-body > p { margin-bottom: 4px; }
      .content .pdf-li-body > p:last-child { margin-bottom: 0; }
      .content blockquote { border-left: 3px solid #b45309; background: #f5eedf; padding: 9px 15px; margin: 14px 0; font-style: italic; color: #451a03; border-radius: 4px; }
      .content blockquote p:last-child { margin-bottom: 0; }
      .content mark { background: #fed7aa; padding: 1px 3px; border-radius: 2px; }
      .content hr { border: 0; border-top: 1px solid #e2d3be; margin: 18px 0; }
      .content pre { white-space: pre-wrap; font-size: 12px; font-family: monospace; }
      .content a { color: #78350f; text-decoration: underline; }
      .empty { color: #92400e; font-style: italic; }
      .reflections { margin-top: 26px; border-top: 2px double #b45309; padding-top: 18px; }
      .reflections h2 { font-size: 16px; line-height: 24px; margin-bottom: 12px; color: #451a03; }
      .reflections-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .reflection-card { padding: 10px 12px; border-radius: 6px; border: 1px solid #d4c3ab; background: #fffdf9; }
      .reflection-label { font-size: 9px; letter-spacing: 1px; font-weight: 700; color: #92400e; margin-bottom: 4px; }
      .reflection-text { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 12px; line-height: 1.5; color: #2e241c; }
    `;
  }
  if (theme === "journal") {
    return `
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; background: #ffffff; color: #1e293b; }
      body { width: ${EXPORT_WIDTH}px; font: 13px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      h1, h2, h3, p, ul, ol, blockquote { margin: 0; }
      .document-header { padding: 16px 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 22px; }
      .eyebrow { font-size: 10px; line-height: 16px; letter-spacing: 2px; color: #0284c7; font-weight: 700; }
      .date { font-size: 11px; line-height: 18px; color: #64748b; margin-top: 3px; }
      .document-title { font-size: 23px; line-height: 1.25; margin: 12px 0 8px; color: #0f172a; font-weight: 700; overflow-wrap: anywhere; }
      .passage { font-size: 13px; line-height: 20px; font-weight: 600; color: #0369a1; }
      .tags { font-size: 11px; line-height: 18px; color: #64748b; margin-top: 6px; }
      .content { overflow-wrap: anywhere; }
      .content h1 { font-size: 19px; line-height: 1.35; margin: 18px 0 8px; color: #0f172a; font-weight: 700; }
      .content h2 { font-size: 16px; line-height: 1.4; margin: 15px 0 6px; color: #0369a1; font-weight: 650; }
      .content h3 { font-size: 14px; line-height: 1.45; margin: 13px 0 4px; color: #334155; font-weight: 600; }
      .content p { margin-bottom: 10px; min-height: 12px; }
      .content ul, .content ol { list-style: none !important; margin: 0 0 10px 0; padding: 0 0 0 2px; }
      .content li.pdf-li { display: flex !important; align-items: flex-start !important; margin-bottom: 5px; list-style: none !important; }
      .content .pdf-li-marker { flex-shrink: 0; width: 14px; margin-right: 8px; text-align: center; line-height: 1.6; font-size: 13px; font-weight: 700; color: #0284c7; }
      .content .pdf-li-body { flex: 1; min-width: 0; }
      .content .pdf-li-body > p { margin-bottom: 4px; }
      .content .pdf-li-body > p:last-child { margin-bottom: 0; }
      .content blockquote { border-left: 3px solid #0284c7; background: #f0f9ff; padding: 9px 15px; margin: 14px 0; font-style: italic; color: #0c4a6e; border-radius: 0 6px 6px 0; }
      .content blockquote p:last-child { margin-bottom: 0; }
      .content mark { background: #bae6fd; padding: 1px 3px; border-radius: 3px; }
      .content hr { border: 0; border-top: 1px solid #e2e8f0; margin: 18px 0; }
      .content pre { white-space: pre-wrap; font-size: 12px; font-family: monospace; }
      .content a { color: #0284c7; text-decoration: underline; }
      .empty { color: #64748b; font-style: italic; }
      .reflections { margin-top: 26px; border-top: 1px solid #e2e8f0; padding-top: 18px; }
      .reflections h2 { font-size: 16px; line-height: 24px; margin-bottom: 12px; color: #0f172a; }
      .reflections-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .reflection-card { padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; }
      .reflection-label { font-size: 9px; letter-spacing: 1px; font-weight: 700; color: #475569; margin-bottom: 4px; }
      .reflection-text { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 12px; line-height: 1.5; color: #1e293b; }
    `;
  }
  // Default minimal
  return `
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #ffffff; color: #171717; }
    body { width: ${EXPORT_WIDTH}px; font: 13px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
    h1, h2, h3, p, ul, ol, blockquote { margin: 0; }
    .document-header { padding: 4px 0 18px; border-bottom: 1.5px solid #171717; margin-bottom: 22px; }
    .eyebrow { font-size: 10px; line-height: 16px; letter-spacing: 2px; color: #737373; font-weight: 600; }
    .date { font-size: 11px; line-height: 18px; color: #737373; margin-top: 4px; }
    .document-title { font-size: 24px; line-height: 1.25; margin: 14px 0 8px; font-weight: 700; overflow-wrap: anywhere; }
    .passage { font-size: 13.5px; line-height: 20px; font-weight: 600; color: #262626; }
    .tags { font-size: 11px; line-height: 18px; color: #737373; margin-top: 6px; }
    .content { overflow-wrap: anywhere; }
    .content h1 { font-size: 19px; line-height: 1.35; margin: 18px 0 8px; font-weight: 700; }
    .content h2 { font-size: 16px; line-height: 1.4; margin: 15px 0 6px; font-weight: 650; }
    .content h3 { font-size: 14px; line-height: 1.45; margin: 13px 0 4px; font-weight: 600; }
    .content p { margin-bottom: 10px; min-height: 12px; }
    .content ul, .content ol { list-style: none !important; margin: 0 0 10px 0; padding: 0 0 0 2px; }
    .content li.pdf-li { display: flex !important; align-items: flex-start !important; margin-bottom: 5px; list-style: none !important; }
    .content .pdf-li-marker { flex-shrink: 0; width: 14px; margin-right: 8px; text-align: center; line-height: 1.6; font-size: 13px; font-weight: 700; color: #171717; }
    .content .pdf-li-body { flex: 1; min-width: 0; }
    .content .pdf-li-body > p { margin-bottom: 4px; }
    .content .pdf-li-body > p:last-child { margin-bottom: 0; }
    .content blockquote { border-left: 3px solid #171717; background: #f7f7f7; padding: 9px 15px; margin: 14px 0; font-style: italic; border-radius: 0 4px 4px 0; }
    .content blockquote p:last-child { margin-bottom: 0; }
    .content mark { background: #ececec; padding: 1px 3px; border-radius: 2px; }
    .content hr { border: 0; border-top: 1px solid #e5e5e5; margin: 18px 0; }
    .content pre { white-space: pre-wrap; font-size: 12px; font-family: monospace; }
    .content a { color: #171717; text-decoration: underline; }
    .empty { color: #737373; font-style: italic; }
    .reflections { margin-top: 26px; border-top: 1px solid #e5e5e5; padding-top: 18px; }
    .reflections h2 { font-size: 16px; line-height: 24px; margin-bottom: 12px; }
    .reflections-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .reflection-card { padding: 10px 12px; border-radius: 6px; border: 1px solid #e5e5e5; background: #fafafa; }
    .reflection-label { font-size: 9px; letter-spacing: 1px; font-weight: 700; color: #737373; margin-bottom: 4px; }
    .reflection-text { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 12px; line-height: 1.5; color: #171717; }
  `;
}

function getStickyCardStyle(color: StickyColor = "yellow"): string {
  const styles: Record<StickyColor, { bg: string; border: string }> = {
    yellow: { bg: "#fef9c3", border: "#fde047" },
    mint: { bg: "#ecfdf5", border: "#a7f3d0" },
    sky: { bg: "#f0f9ff", border: "#bae6fd" },
    lavender: { bg: "#f5f3ff", border: "#ddd6fe" },
    peach: { bg: "#fff7ed", border: "#fed7aa" },
    rose: { bg: "#fff1f2", border: "#fecdd3" },
    slate: { bg: "#f8fafc", border: "#e2e8f0" },
  };
  const c = styles[color] || styles.yellow;
  return `background-color: ${c.bg}; border: 1px solid ${c.border};`;
}

function getThemeConfig(theme: PdfTheme) {
  if (theme === "parchment") {
    return {
      backgroundColor: "#fbf7ef",
      bgR: 251,
      bgG: 247,
      bgB: 239,
      footerLineColor: [212, 195, 171] as [number, number, number],
      footerTextColor: [120, 53, 15] as [number, number, number],
      footerText: "HIS PRESENCE / SCRIPTURAL STUDY",
    };
  }
  if (theme === "journal") {
    return {
      backgroundColor: "#ffffff",
      bgR: 255,
      bgG: 255,
      bgB: 255,
      footerLineColor: [226, 232, 240] as [number, number, number],
      footerTextColor: [100, 116, 139] as [number, number, number],
      footerText: "HIS PRESENCE / STUDY JOURNAL",
    };
  }
  return {
    backgroundColor: "#ffffff",
    bgR: 255,
    bgG: 255,
    bgB: 255,
    footerLineColor: [229, 229, 229] as [number, number, number],
    footerTextColor: [115, 115, 115] as [number, number, number],
    footerText: "HIS PRESENCE / BIBLE STUDY",
  };
}

export async function exportStudyToPdf(
  study: BibleStudy,
  theme: PdfTheme = "minimal",
): Promise<void> {
  const themeConfig = getThemeConfig(theme);
  const frame = document.createElement("iframe");
  frame.title = "PDF export renderer";
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  Object.assign(frame.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: `${EXPORT_WIDTH}px`,
    height: "1000px",
    border: "0",
  });
  document.body.appendChild(frame);

  try {
    const exportDocument = frame.contentDocument;
    if (!exportDocument) throw new Error("Could not prepare the PDF document.");

    // Restrict exported HTML to the editor's supported text formatting.
    const source = new DOMParser().parseFromString(
      study.contentHtml,
      "text/html",
    );
    const allowed = new Set([
      "P",
      "BR",
      "H1",
      "H2",
      "H3",
      "UL",
      "OL",
      "LI",
      "BLOCKQUOTE",
      "STRONG",
      "B",
      "EM",
      "I",
      "U",
      "S",
      "STRIKE",
      "SPAN",
      "MARK",
      "HR",
      "PRE",
      "CODE",
      "DIV",
    ]);

    for (const element of Array.from(
      source.body.querySelectorAll("*"),
    ).reverse()) {
      if (
        ["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED"].includes(
          element.tagName,
        )
      ) {
        element.remove();
      } else if (!allowed.has(element.tagName)) {
        element.replaceWith(...Array.from(element.childNodes));
      } else {
        const inlineStyle = (element as HTMLElement).style;
        const color = inlineStyle.color;
        const background = inlineStyle.backgroundColor;
        for (const attr of Array.from(element.attributes))
          element.removeAttribute(attr.name);
        if (color) (element as HTMLElement).style.color = color;
        if (background)
          (element as HTMLElement).style.backgroundColor = background;
      }
    }

    // Transform lists into two-column flex rows with aligned markers
    // This completely resolves html2canvas bullet misalignment on multi-paragraph/line items
    const lists = Array.from(source.body.querySelectorAll("ul, ol"));
    for (const list of lists) {
      const isOl = list.tagName.toUpperCase() === "OL";
      const items = Array.from(list.children).filter(
        (c) => c.tagName.toUpperCase() === "LI",
      );
      items.forEach((li, index) => {
        const marker = source.createElement("span");
        marker.className = "pdf-li-marker";
        marker.textContent = isOl ? `${index + 1}.` : "•";

        const bodyContainer = source.createElement("div");
        bodyContainer.className = "pdf-li-body";
        while (li.firstChild) {
          bodyContainer.appendChild(li.firstChild);
        }

        li.className = "pdf-li";
        li.appendChild(marker);
        li.appendChild(bodyContainer);
      });
    }

    const formattedDate = new Date(
      study.updatedAt || study.createdAt,
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const hasContent = Boolean(source.body.textContent?.trim());
    const exportCss = getExportCss(theme);

    exportDocument.open();
    exportDocument.write(`<!doctype html><html><head><meta charset="utf-8"><style>${exportCss}</style></head>
      <body>
        <header class="document-header">
          <div class="eyebrow">BIBLE STUDY NOTES</div>
          <div class="date">${escapeHtml(formattedDate)}</div>
          <h1 class="document-title">${escapeHtml(study.title || "Untitled Bible Study")}</h1>
          ${study.passage ? `<div class="passage">${escapeHtml(study.passage)}</div>` : ""}
          ${study.tags.length ? `<div class="tags">${study.tags.map(escapeHtml).join(" &nbsp; / &nbsp; ")}</div>` : ""}
        </header>
        <main class="content">${hasContent ? source.body.innerHTML : '<p class="empty">No study notes have been added yet.</p>'}</main>
        ${
          study.stickyNotes.length
            ? `<section class="reflections"><h2>Thoughts &amp; reflections</h2>
          <div class="reflections-grid">
            ${study.stickyNotes
              .map(
                (note, index) => `<div class="reflection-card" style="${getStickyCardStyle(note.color)}">
                  <div class="reflection-label">NOTE ${index + 1}</div>
                  <div class="reflection-text">${escapeHtml(note.content || "(Empty reflection)")}</div>
                </div>`,
              )
              .join("")}
          </div>
        </section>`
            : ""
        }
      </body></html>`);
    exportDocument.close();
    await exportDocument.fonts.ready;
    const body = exportDocument.body;
    frame.style.height = `${body.scrollHeight + 20}px`;

    const canvas = await html2canvas(body, {
      scale: 2,
      backgroundColor: themeConfig.backgroundColor,
      logging: false,
      width: EXPORT_WIDTH,
      height: body.scrollHeight,
      windowWidth: EXPORT_WIDTH,
      windowHeight: body.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    const margin = 16;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    const pixelsPerMm = canvas.width / contentWidth;
    const maxSliceHeight = Math.floor(
      (pageHeight - margin * 2 - 10) * pixelsPerMm,
    );
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not render the PDF pages.");

    let offset = 0;
    while (offset < canvas.height) {
      let end = Math.min(offset + maxSliceHeight, canvas.height);
      if (end < canvas.height) {
        // Find whitespace near page boundary so lines aren't cut in half
        const scanStart = Math.max(offset + 1, end - Math.round(90 * 2));
        const strip = context.getImageData(
          0,
          scanStart,
          canvas.width,
          end - scanStart,
        );
        for (let row = strip.height - 1; row >= 0; row--) {
          let blank = true;
          for (let x = 0; x < strip.width; x++) {
            const i = (row * strip.width + x) * 4;
            const diff =
              Math.abs(strip.data[i] - themeConfig.bgR) +
              Math.abs(strip.data[i + 1] - themeConfig.bgG) +
              Math.abs(strip.data[i + 2] - themeConfig.bgB);
            if (diff > 25) {
              blank = false;
              break;
            }
          }
          if (blank) {
            end = scanStart + row + 1;
            break;
          }
        }
      }
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = end - offset;
      const sliceContext = slice.getContext("2d");
      if (!sliceContext) throw new Error("Could not compose a PDF page.");

      // Fill with background color before drawing image to avoid black JPEG artifacts
      sliceContext.fillStyle = themeConfig.backgroundColor;
      sliceContext.fillRect(0, 0, slice.width, slice.height);
      sliceContext.drawImage(
        canvas,
        0,
        offset,
        canvas.width,
        slice.height,
        0,
        0,
        slice.width,
        slice.height,
      );

      if (offset > 0) pdf.addPage();
      // Use compressed JPEG with FAST compression for massive file size savings (~80-90% smaller)
      pdf.addImage(
        slice.toDataURL("image/jpeg", 0.90),
        "JPEG",
        margin,
        margin,
        contentWidth,
        slice.height / pixelsPerMm,
        undefined,
        "FAST",
      );
      offset = end;
    }

    const pageCount = pdf.getNumberOfPages();
    for (let page = 1; page <= pageCount; page++) {
      pdf.setPage(page);
      pdf.setDrawColor(...themeConfig.footerLineColor);
      pdf.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(...themeConfig.footerTextColor);
      pdf.text(themeConfig.footerText, margin, pageHeight - 10);
      pdf.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 10, {
        align: "right",
      });
    }
    const safeTitle =
      (study.title || "bible-study")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50) || "bible-study";
    pdf.save(`${safeTitle}.pdf`);
  } finally {
    frame.remove();
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
