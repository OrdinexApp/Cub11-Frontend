"use client";

import { Captions, Music, Type, Scissors } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubtitlesTab } from "./tabs/SubtitlesTab";
import { MusicTab } from "./tabs/MusicTab";
import { TextTab } from "./tabs/TextTab";
import { TrimSpeedTab } from "./tabs/TrimSpeedTab";
import { useEditorStore, type EditorTab } from "@/lib/stores/editor-store";

const TABS: { id: EditorTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "subtitles", label: "Subtitles", icon: Captions },
  { id: "music", label: "Music", icon: Music },
  { id: "text", label: "Text", icon: Type },
  { id: "trim", label: "Trim & Speed", icon: Scissors },
];

export function EditorTabs() {
  const tab = useEditorStore((s) => s.activeTab);
  const setTab = useEditorStore((s) => s.setActiveTab);

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as EditorTab)} className="w-full">
      <TabsList className="w-full grid grid-cols-4 h-14 bg-card border border-border/60">
        {TABS.map((t) => (
          <TabsTrigger key={t.id} value={t.id} className="flex flex-col gap-0.5 h-full">
            <t.icon className="h-4 w-4" />
            <span className="text-[11px] sm:text-xs">{t.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="subtitles">
        <SubtitlesTab />
      </TabsContent>
      <TabsContent value="music">
        <MusicTab />
      </TabsContent>
      <TabsContent value="text">
        <TextTab />
      </TabsContent>
      <TabsContent value="trim">
        <TrimSpeedTab />
      </TabsContent>
    </Tabs>
  );
}
