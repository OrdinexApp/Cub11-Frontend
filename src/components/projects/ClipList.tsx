"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ClipCard } from "./ClipCard";
import type { Clip } from "@/types/clip";

interface Props {
  clips: Clip[];
  onReorder: (ids: string[]) => void;
  onDelete?: (id: string) => void;
}

export function ClipList({ clips, onReorder, onDelete }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = clips.findIndex((c) => c.id === active.id);
    const newIndex = clips.findIndex((c) => c.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(clips, oldIndex, newIndex);
    onReorder(reordered.map((c) => c.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={clips.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col gap-3">
          {clips.map((clip) => (
            <li key={clip.id}>
              <ClipCard clip={clip} onDelete={onDelete} />
            </li>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
