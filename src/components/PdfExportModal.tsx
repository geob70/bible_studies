'use strict';
'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Check, 
  FileText, 
  Layers, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { BibleStudy } from '@/types/bible-study';
import { exportStudyToPdf } from '@/lib/pdf-export';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  study: BibleStudy;
}

export default function PdfExportModal({
  isOpen,
  onClose,
  study,
}: PdfExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [includeStickyNotes, setIncludeStickyNotes] = useState(true);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const studyToExport: BibleStudy = {
        ...study,
        stickyNotes: includeStickyNotes ? study.stickyNotes : [],
      };
      await exportStudyToPdf(studyToExport);
      onClose();
    } catch (err) {
      console.error('PDF export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#ffffff] border border-[#0a0a0a1a] rounded-[24px] max-w-lg w-full p-6 shadow-2xl flex flex-col space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#0a0a0a14]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-[#ffffff] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0a0a0a]">
                Export Formatted PDF
              </h2>
              <p className="text-xs text-[#6b6b6b]">
                Save your Bible study notes with styled headings, verses, and sticky notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon-pill"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Study Summary Card */}
        <div className="p-4 rounded-[16px] bg-[#f5f5f5] border border-[#0a0a0a14] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider">
              Document Preview
            </span>
            <span className="text-xs font-medium text-[#111111] px-2 py-0.5 rounded-full bg-white border border-[#0a0a0a14]">
              {study.passage || 'General Study'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#0a0a0a]">
            {study.title || 'Untitled Bible Study'}
          </h3>
          <p className="text-xs text-[#6b6b6b] line-clamp-2">
            Includes your formatted study notes and {study.stickyNotes?.length || 0} sticky notes.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-[12px] border border-[#0a0a0a14] bg-white cursor-pointer hover:bg-[#f5f5f5] transition-colors">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#111111]" />
              <div>
                <span className="font-semibold text-[#0a0a0a] block">
                  Include Sticky Notes Section
                </span>
                <span className="text-[#6b6b6b]">
                  Renders your {study.stickyNotes?.length || 0} sticky notes at the bottom of the PDF
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeStickyNotes}
              onChange={(e) => setIncludeStickyNotes(e.target.checked)}
              className="w-4 h-4 accent-[#111111] cursor-pointer"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#0a0a0a14]">
          <button
            onClick={onClose}
            className="btn-pill text-xs py-2 px-4"
            disabled={isExporting}
          >
            Cancel
          </button>

          <button
            onClick={handlePrint}
            className="btn-pill text-xs py-2 px-4"
            disabled={isExporting}
            title="Open browser print dialog for high-res vector PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Vector
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="btn-pill btn-pill-primary text-xs py-2 px-5"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
