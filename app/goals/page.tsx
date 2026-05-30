'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import {
  clearReadingGoal,
  getReadingGoal,
  setReadingGoal,
  getStreak,
} from '@/lib/services/progressService';
import type { ReadingGoal } from '@/lib/types/user';

export default function GoalsPage() {
  const [goal, setGoal] = useState<ReadingGoal | null>(null);
  const [type, setType] = useState<ReadingGoal['type']>('ayahs');
  const [target, setTarget] = useState(20);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setGoal(getReadingGoal());
    setStreak(getStreak());
  }, []);

  const onSave = () => {
    const g: ReadingGoal = { type, target, startedAt: new Date().toISOString() };
    setReadingGoal(g);
    setGoal(g);
  };

  return (
    <>
      <PageHeader
        eyebrow="Habit"
        title="Reading Goals"
        description="Choose a sustainable daily target. Your streak counts every day you read at least one ayah."
      />
      <AppShell>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-400/80">
              <Icon name="target" size={13} />
              Current goal
            </div>
            {goal ? (
              <>
                <h3 className="mt-3 font-display text-2xl text-cream-50">
                  {goal.target} {goal.type} per day
                </h3>
                <p className="mt-2 text-sm text-cream-200/65">
                  Started on {new Date(goal.startedAt).toLocaleDateString()}.
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-4"
                  onClick={() => {
                    clearReadingGoal();
                    setGoal(null);
                  }}
                >
                  Remove goal
                </Button>
              </>
            ) : (
              <p className="mt-3 text-sm text-cream-200/65">No goal set yet.</p>
            )}
            <div className="mt-6 rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
              <div className="text-xs uppercase tracking-wider text-cream-200/45">Streak</div>
              <p className="mt-1 font-display text-2xl text-cream-50">{streak} days</p>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <h3 className="font-display text-lg text-cream-50">Set a new goal</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Select
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value as ReadingGoal['type'])}
                options={[
                  { value: 'ayahs', label: 'Ayahs' },
                  { value: 'pages', label: 'Pages' },
                  { value: 'minutes', label: 'Minutes' },
                ]}
              />
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-cream-200/70">
                  Daily target
                </label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={target}
                  onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-ink-600/70 bg-ink-800/70 px-4 text-sm text-cream-50 focus:border-gold-500/50 focus:outline-none"
                />
              </div>
            </div>
            <Button className="mt-5" onClick={onSave}>
              Save goal
            </Button>
          </Card>
        </div>
      </AppShell>
    </>
  );
}
