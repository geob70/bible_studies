'use strict';
'use client';

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Trash2, 
  Copy, 
  BookOpen, 
  StickyNote as StickyIcon, 
  Upload, 
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import { BibleStudy } from '@/types/bible-study';
import { exportStudiesToJson, importStudiesFromJson } from '@/lib/storage';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  studies: BibleStudy[];
  activeStudyId: string;
  onSelectStudy: (id: string) => void;
  onNewStudy: (template?: 'blank' | 'soap' | 'inductive') => void;
  onDeleteStudy: (id: string) => void;
  onDuplicateStudy: (study: BibleStudy) => void;
  onReloadAllStudies: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  studies,
  activeStudyId,
  onSelectStudy,
  onNewStudy,
  onDeleteStudy,
  onDuplicateStudy,
  onReloadAllStudies,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredStudies = studies.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      (s.passage && s.passage.toLowerCase().includes(q)) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleExportJson = () => {
    const jsonStr = exportStudiesToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bible-studies-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importStudiesFromJson(content);
      if (success) {
        setImportStatus('Backup restored successfully!');
        onReloadAllStudies();
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Error: Invalid JSON format.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-80 sm:w-96 bg-[#ffffff] border-r border-[#2525251a] z-40 flex flex-col shadow-2xl transition-transform duration-200 ease-in-out">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#2525251a] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#6b6b6b] uppercase">
            STUDY ARCHIVE
          </span>
          <h2 className="text-base font-semibold text-[#252525]">
            My Bible Notes
          </h2>
        </div>
        <button
          onClick={onClose}
          className="btn-icon-pill"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4 text-[#252525]" />
        </button>
      </div>

      {/* Action / Search Bar */}
      <div className="p-4 space-y-3 border-b border-[#25252514] bg-[#f5f5f5]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6b6b6b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, passages, tags..."
            className="w-full bg-[#ffffff] border border-[#2525251a] rounded-[9999px] pl-9 pr-4 py-1.5 text-xs text-[#252525] placeholder-[#a1a1a1] focus:border-[#252525] outline-hidden"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNewStudy('blank')}
            className="btn-pill btn-pill-primary flex-1 text-xs py-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Study</span>
          </button>
          <button
            onClick={() => onNewStudy('soap')}
            className="btn-pill text-xs py-2 px-3"
            title="Create SOAP Study"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
            <span>SOAP</span>
          </button>
        </div>
      </div>

      {/* Study List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredStudies.length === 0 ? (
          <div className="text-center py-12 px-4">
            <BookOpen className="w-8 h-8 text-[#a1a1a1] mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[#6b6b6b]">No studies found.</p>
          </div>
        ) : (
          filteredStudies.map((study) => {
            const isActive = study.id === activeStudyId;
            const dateStr = new Date(study.updatedAt || study.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={study.id}
                onClick={() => onSelectStudy(study.id)}
                className={`group relative p-3 rounded-[16px] cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-[#171717] text-[#ffffff] border-[#171717] shadow-xs'
                    : 'bg-[#ffffff] text-[#252525] border-[#25252514] hover:border-[#25252533] hover:bg-[#f5f5f5]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-sm font-semibold leading-snug line-clamp-1 ${isActive ? 'text-[#ffffff]' : 'text-[#252525]'}`}>
                    {study.title || 'Untitled Study'}
                  </h3>

                  {/* Actions on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateStudy(study);
                      }}
                      className={`p-1 rounded-full hover:bg-black/10 transition-colors ${
                        isActive ? 'text-white/80 hover:text-white' : 'text-[#6b6b6b] hover:text-[#252525]'
                      }`}
                      title="Duplicate this study"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {studies.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${study.title}"?`)) {
                            onDeleteStudy(study.id);
                          }
                        }}
                        className={`p-1 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors ${
                          isActive ? 'text-white/80' : 'text-[#6b6b6b]'
                        }`}
                        title="Delete study"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub info */}
                <div className="flex items-center gap-2 mt-2 text-[11px]">
                  {study.passage && (
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#f5f5f5] text-[#171717] border border-[#25252514]'
                      }`}
                    >
                      {study.passage}
                    </span>
                  )}
                  {study.stickyNotes?.length > 0 && (
                    <span
                      className={`flex items-center gap-1 ${
                        isActive ? 'text-white/70' : 'text-[#6b6b6b]'
                      }`}
                    >
                      <StickyIcon className="w-3 h-3" />
                      {study.stickyNotes.length}
                    </span>
                  )}
                  <span
                    suppressHydrationWarning
                    className={`ml-auto flex items-center gap-1 ${
                      isActive ? 'text-white/60' : 'text-[#a1a1a1]'
                    }`}
                  >
                    <Calendar className="w-2.5 h-2.5" />
                    {dateStr}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info & Backup */}
      <div className="p-3 border-t border-[#2525251a] bg-[#ffffff] space-y-2">
        {importStatus && (
          <div className="p-2 text-xs font-medium text-center rounded-lg bg-green-50 text-green-700 border border-green-200">
            {importStatus}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[#6b6b6b] px-1">
          <span>{studies.length} {studies.length === 1 ? 'Study' : 'Studies'} stored locally</span>
          <span>Offline Ready</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportJson}
            className="btn-pill text-xs py-1.5 justify-center"
            title="Download JSON backup of all studies"
          >
            <Download className="w-3 h-3" />
            Backup JSON
          </button>

          <label className="btn-pill text-xs py-1.5 justify-center cursor-pointer">
            <Upload className="w-3 h-3" />
            Restore
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
