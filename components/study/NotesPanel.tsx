'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Icon } from '@/components/ui/Icon';
import { deleteNote, getNoteForAyah, upsertNote } from '@/lib/services/notesService';

interface NotesPanelProps {
  surah: number;
  ayah: number;
  open: boolean;
  onClose: () => void;
}

export function NotesPanel({ surah, ayah, open, onClose }: NotesPanelProps) {
  const [text, setText] = useState('');
  const [noteId, setNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const existing = getNoteForAyah(surah, ayah);
    setText(existing?.text ?? '');
    setNoteId(existing?.id ?? null);
  }, [open, surah, ayah]);

  const onSave = () => {
    const saved = upsertNote(surah, ayah, text.trim());
    setNoteId(saved.id);
  };

  const onDelete = () => {
    if (!noteId) return;
    deleteNote(noteId);
    setText('');
    setNoteId(null);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Note · ${surah}:${ayah}`}
      description="Private to this device. Notes are never shared automatically."
      side="right"
    >
      <div className="flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add your reflection on this ayah…"
          rows={10}
          maxLength={4000}
          className="w-full resize-none rounded-xl border border-ink-600 bg-ink-800/70 p-4 text-sm leading-relaxed text-cream-50 placeholder:text-cream-200/40 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
        />
        <p className="text-xs text-cream-200/55">{text.length} / 4000 characters</p>
        <div className="flex justify-between gap-2">
          {noteId && (
            <Button variant="ghost" size="md" onClick={onDelete}>
              <Icon name="close" size={14} />
              Delete note
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button size="md" onClick={onSave}>
              Save note
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
