"use strict";
"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Palette,
  Sparkles,
} from "lucide-react";
import { StickyColor, StickyNote } from "@/types/bible-study";

interface StickyNotesBarProps {
  stickyNotes: StickyNote[];
  onAddStickyNote: (content?: string, color?: StickyColor) => void;
  onUpdateStickyNote: (id: string, updates: Partial<StickyNote>) => void;
  onDeleteStickyNote: (id: string) => void;
  onInsertIntoNotes: (content: string) => void;
}

const COLOR_VARIANTS: {
  id: StickyColor;
  name: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
}[] = [
  {
    id: "yellow",
    name: "Paper",
    bg: "#f6f6f6",
    border: "#dbdbdb",
    text: "#464646",
    dot: "#b2b2b2",
  },
  {
    id: "mint",
    name: "Mist",
    bg: "#f4f4f4",
    border: "#d4d4d4",
    text: "#434343",
    dot: "#9b9b9b",
  },
  {
    id: "sky",
    name: "Silver",
    bg: "#efefef",
    border: "#c4c4c4",
    text: "#3f3f3f",
    dot: "#8a8a8a",
  },
  {
    id: "lavender",
    name: "Stone",
    bg: "#ececec",
    border: "#c1c1c1",
    text: "#303030",
    dot: "#727272",
  },
  {
    id: "peach",
    name: "Pearl",
    bg: "#efefef",
    border: "#dcdcdc",
    text: "#3c3c3c",
    dot: "#898989",
  },
  {
    id: "rose",
    name: "Cloud",
    bg: "#eaeaea",
    border: "#d8d8d8",
    text: "#2e2e2e",
    dot: "#717171",
  },
];

export default function StickyNotesBar({
  stickyNotes,
  onAddStickyNote,
  onUpdateStickyNote,
  onDeleteStickyNote,
  onInsertIntoNotes,
}: StickyNotesBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeColorPickerId, setActiveColorPickerId] = useState<string | null>(
    null,
  );

  const handleInsertNoteContent = (note: StickyNote) => {
    if (!note.content) return;
    const snippet = `<p><strong>Sticky Thought:</strong> ${escapeHtml(note.content)}</p>`;
    onInsertIntoNotes(snippet);
  };

  return (
    <section className="reflections w-full bg-[#f5f5f5] border-t border-[#2525251a] flex flex-col transition-all duration-200 z-20">
      {/* Bar Header / Collapse toggle */}
      <div className="px-4 py-1.5 flex items-center justify-between border-b border-[#2525250f] text-xs text-[#6b6b6b]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#171717]">
            THOUGHTS TO KEEP
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#ffffff] border border-[#25252514] text-[11px] font-semibold text-[#252525]">
            {stickyNotes.length}
          </span>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1 hover:text-[#252525] transition-colors cursor-pointer py-0.5 px-2 rounded-full hover:bg-[#ffffff]"
          title={
            isCollapsed
              ? "Expand sticky notes drawer"
              : "Collapse sticky notes drawer"
          }
        >
          <span>{isCollapsed ? "Expand" : "Minimize"}</span>
          {isCollapsed ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 flex items-start gap-4 overflow-x-auto min-h-[175px]">
          {/* Add Sticky Note Pill Button (Wireframe Match) */}
          <div className="shrink-0 flex flex-col justify-start">
            <button
              onClick={() => onAddStickyNote()}
              className="btn-pill btn-pill-primary h-[140px] w-36 flex flex-col items-center justify-center gap-2 rounded-[24px] hover:scale-102 transition-transform shadow-xs"
              title="Add a new colorful sticky note"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-white text-center leading-tight">
                Add a reflection
              </span>
            </button>
          </div>

          {/* Sticky Notes Cards Row */}
          {stickyNotes.length === 0 ? (
            <div className="h-[140px] flex items-center justify-center px-8 border-2 border-dashed border-[#2525251a] rounded-[24px] text-xs text-[#6b6b6b]">
              Capture a thought, save a verse, or leave a question for later.
            </div>
          ) : (
            stickyNotes.map((note) => {
              const currentVariant =
                COLOR_VARIANTS.find((c) => c.id === note.color) ||
                COLOR_VARIANTS[0];

              return (
                <div
                  key={note.id}
                  className="shrink-0 w-64 h-[140px] rounded-[20px] p-3.5 flex flex-col justify-between relative shadow-xs transition-all hover:shadow-md group"
                  style={{
                    backgroundColor: currentVariant.bg,
                    border: `1.5px solid ${currentVariant.border}`,
                    color: currentVariant.text,
                  }}
                >
                  {/* Card Top: Pin indicator & color switcher */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: currentVariant.dot }}
                      title={currentVariant.name}
                    />

                    <div className="relative flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Color Picker Toggle */}
                      <button
                        onClick={() =>
                          setActiveColorPickerId(
                            activeColorPickerId === note.id ? null : note.id,
                          )
                        }
                        className="p-1 rounded-full hover:bg-black/10 transition-colors"
                        title="Change note color"
                      >
                        <Palette className="w-3 h-3" />
                      </button>

                      {/* Color Menu Popover */}
                      {activeColorPickerId === note.id && (
                        <div
                          className="absolute right-0 top-6 bg-[#ffffff] border border-[#2525251a] rounded-[16px] p-1.5 shadow-lg flex gap-1 z-30"
                          onMouseLeave={() => setActiveColorPickerId(null)}
                        >
                          {COLOR_VARIANTS.map((variant) => (
                            <button
                              key={variant.id}
                              onClick={() => {
                                onUpdateStickyNote(note.id, {
                                  color: variant.id,
                                });
                                setActiveColorPickerId(null);
                              }}
                              className="w-4 h-4 rounded-full border border-black/10 hover:scale-125 transition-transform"
                              style={{ backgroundColor: variant.dot }}
                              title={variant.name}
                            />
                          ))}
                        </div>
                      )}

                      {/* Insert to notes */}
                      <button
                        onClick={() => handleInsertNoteContent(note)}
                        className="p-1 rounded-full hover:bg-black/10 transition-colors"
                        title="Send note to main editor"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                      </button>

                      {/* Delete note */}
                      <button
                        onClick={() => onDeleteStickyNote(note.id)}
                        className="p-1 rounded-full hover:bg-red-500/20 hover:text-red-700 transition-colors"
                        title="Delete sticky note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body: Textarea */}
                  <textarea
                    value={note.content}
                    onChange={(e) =>
                      onUpdateStickyNote(note.id, { content: e.target.value })
                    }
                    placeholder="Write a note..."
                    className="flex-1 w-full bg-transparent resize-none border-none outline-hidden text-xs leading-relaxed font-medium placeholder-black/40"
                    style={{ color: currentVariant.text }}
                  />

                  {/* Card Bottom: Date */}
                  <div className="flex justify-between items-center text-[10px] opacity-60 pt-1 border-t border-black/10">
                    <span>Sticky Note</span>
                    <span>
                      {new Date(note.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
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
