'use strict';
'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  Pilcrow, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Palette, 
  Highlighter, 
  RemoveFormatting,
  Tag,
  BookMarked
} from 'lucide-react';
import { BibleStudy } from '@/types/bible-study';

interface EditorProps {
  study: BibleStudy;
  onUpdateStudy: (updates: Partial<BibleStudy>) => void;
  insertContentTrigger?: { content: string; timestamp: number } | null;
}

const TEXT_COLORS = [
  { name: 'Default', value: '#0a0a0a' },
  { name: 'Muted Ink', value: '#6b6b6b' },
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Crimson', value: '#991b1b' },
  { name: 'Forest', value: '#14532d' },
  { name: 'Burgundy', value: '#701a75' },
  { name: 'Amber', value: '#b45309' },
];

const HIGHLIGHT_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Mint', value: '#bbf7d0' },
  { name: 'Sky', value: '#bae6fd' },
  { name: 'Pink', value: '#fbcfe8' },
  { name: 'Peach', value: '#fed7aa' },
];

export default function Editor({
  study,
  onUpdateStudy,
  insertContentTrigger,
}: EditorProps) {
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your study notes, reflections, or insert verses from the Bible reader...',
      }),
    ],
    content: study.contentHtml,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content focus:outline-hidden min-h-[420px] pb-24',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onUpdateStudy({
        contentHtml: ed.getHTML(),
      });
    },
  });

  // Sync content when active study changes
  useEffect(() => {
    if (editor && study.contentHtml !== editor.getHTML()) {
      editor.commands.setContent(study.contentHtml || '', { emitUpdate: false });
    }
  }, [study.id, editor]);

  // Handle external insertions (from Bible reader or sticky note)
  useEffect(() => {
    if (editor && insertContentTrigger) {
      editor.commands.focus('end');
      editor.commands.insertContent(insertContentTrigger.content);
    }
  }, [insertContentTrigger, editor]);

  if (!editor) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-sm text-[#6b6b6b]">
        Loading text editor...
      </div>
    );
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!study.tags.includes(newTag)) {
        onUpdateStudy({ tags: [...study.tags, newTag] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateStudy({ tags: study.tags.filter((t) => t !== tagToRemove) });
  };

  const wordCount = editor.storage.characterCount
    ? editor.storage.characterCount.words()
    : editor.getText().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ffffff] overflow-hidden">
      {/* Editor Header: Title, Passage & Metadata */}
      <div className="px-6 pt-5 pb-3 border-b border-[#0a0a0a14] bg-[#ffffff]">
        <input
          type="text"
          value={study.title}
          onChange={(e) => onUpdateStudy({ title: e.target.value })}
          placeholder="Study Title..."
          className="w-full text-2xl font-bold tracking-tight text-[#0a0a0a] placeholder-[#a1a1a1] border-none outline-hidden bg-transparent mb-2.5"
        />

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Passage reference */}
          <div className="flex items-center gap-1.5 bg-[#f5f5f5] border border-[#0a0a0a1a] rounded-full px-3 py-1">
            <BookMarked className="w-3.5 h-3.5 text-[#111111]" />
            <input
              type="text"
              value={study.passage}
              onChange={(e) => onUpdateStudy({ passage: e.target.value })}
              placeholder="Passage (e.g. John 1)"
              className="bg-transparent text-xs font-semibold text-[#111111] placeholder-[#a1a1a1] outline-hidden w-40"
            />
          </div>

          {/* Tags */}
          {study.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f5f5f5] text-[#6b6b6b] border border-[#0a0a0a14] text-[11px]"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-[#0a0a0a] ml-0.5 font-bold cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}

          <div className="flex items-center gap-1 bg-[#ffffff] rounded-full px-2 py-0.5 border border-[#0a0a0a14]">
            <Tag className="w-3 h-3 text-[#a1a1a1]" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag + Enter"
              className="bg-transparent text-[11px] text-[#0a0a0a] placeholder-[#a1a1a1] outline-hidden w-24"
            />
          </div>

          <span className="ml-auto text-[11px] text-[#a1a1a1]">
            {wordCount} words
          </span>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="px-4 py-2 bg-[#f5f5f5] border-b border-[#0a0a0a14] flex flex-wrap items-center gap-1 text-xs select-none">
        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('paragraph') ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Paragraph"
        >
          <Pilcrow className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-[#0a0a0a1a] mx-1" />

        {/* Inline styles */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('bold') ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('italic') ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('underline') ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('strike') ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-[#0a0a0a1a] mx-1" />

        {/* Color picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowColorMenu(!showColorMenu);
              setShowHighlightMenu(false);
            }}
            className="p-1.5 rounded-md hover:bg-[#ffffff] transition-colors text-[#6b6b6b] flex items-center gap-1"
            title="Text Color"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>
          {showColorMenu && (
            <div className="absolute left-0 mt-1 p-2 bg-[#ffffff] border border-[#0a0a0a1a] rounded-[12px] shadow-lg flex gap-1 z-30">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    editor.chain().focus().setColor(c.value).run();
                    setShowColorMenu(false);
                  }}
                  className="w-5 h-5 rounded-full border border-black/10 transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowHighlightMenu(!showHighlightMenu);
              setShowColorMenu(false);
            }}
            className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
              editor.isActive('highlight') ? 'bg-[#ffffff] text-amber-600 shadow-xs' : 'text-[#6b6b6b]'
            }`}
            title="Highlight Color"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
          {showHighlightMenu && (
            <div className="absolute left-0 mt-1 p-2 bg-[#ffffff] border border-[#0a0a0a1a] rounded-[12px] shadow-lg flex gap-1.5 z-30">
              {HIGHLIGHT_COLORS.map((h) => (
                <button
                  key={h.name}
                  onClick={() => {
                    if (h.value === 'transparent') {
                      editor.chain().focus().unsetHighlight().run();
                    } else {
                      editor.chain().focus().setHighlight({ color: h.value }).run();
                    }
                    setShowHighlightMenu(false);
                  }}
                  className="w-5 h-5 rounded-full border border-black/15 transition-transform hover:scale-110 cursor-pointer flex items-center justify-center text-[9px]"
                  style={{ backgroundColor: h.value }}
                  title={h.name}
                >
                  {h.name === 'None' && '✕'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-[1px] h-4 bg-[#0a0a0a1a] mx-1" />

        {/* Lists & Quotes */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('bulletList') ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('orderedList') ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-md hover:bg-[#ffffff] transition-colors ${
            editor.isActive('blockquote') ? 'bg-[#ffffff] font-bold text-[#0a0a0a] shadow-xs' : 'text-[#6b6b6b]'
          }`}
          title="Scripture Quote / Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 rounded-md hover:bg-[#ffffff] transition-colors text-[#6b6b6b]"
          title="Clear formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-[#0a0a0a1a] mx-1 ml-auto" />

        {/* History */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-md hover:bg-[#ffffff] transition-colors text-[#6b6b6b] disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-md hover:bg-[#ffffff] transition-colors text-[#6b6b6b] disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Content Canvas */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
