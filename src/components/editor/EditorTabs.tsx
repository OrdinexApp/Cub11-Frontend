"use client";

import { Captions, Music, Type, Scissors } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { SubtitlesTab } from "./tabs/SubtitlesTab";
import { MusicTab } from "./tabs/MusicTab";
import { TextTab } from "./tabs/TextTab";
import { TrimSpeedTab } from "./tabs/TrimSpeedTab";
import { useEditorStore, type EditorTab } from "@/lib/stores/editor-store";
import { cn } from "@/lib/utils";

const TABS: {
  id: EditorTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "subtitles", label: "Subtitles", icon: Captions },
  { id: "music", label: "Music", icon: Music },
  { id: "text", label: "Text", icon: Type },
  { id: "trim", label: "Trim & Speed", icon: Scissors },
];

const PANELS: Record<EditorTab, React.ComponentType> = {
  subtitles: SubtitlesTab,
  music: MusicTab,
  text: TextTab,
  trim: TrimSpeedTab,
};

export function EditorTabs() {
  const tab = useEditorStore((s) => s.activeTab);
  const setTab = useEditorStore((s) => s.setActiveTab);
  const ActivePanel = PANELS[tab];

  return (
    <div className="flex flex-col gap-4">
      <LayoutGroup id="editor-tabs">
        <div
          role="tablist"
          aria-label="Clip editor tabs"
          className="grid grid-cols-4 gap-1 rounded-2xl bg-card border border-border/60 p-1.5"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 h-14 rounded-xl text-[11px] sm:text-xs font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="editor-tab-active"
                    className="absolute inset-0 rounded-xl bg-primary/12 ring-1 ring-primary/25"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                  />
                )}
                <t.icon className="relative h-4 w-4" />
                <span className="relative leading-none">{t.label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Changes sync automatically and update preview live.
        </p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          >
            <ActivePanel />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
