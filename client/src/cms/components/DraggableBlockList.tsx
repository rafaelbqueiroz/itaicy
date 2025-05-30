import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { Block } from '@/lib/supabase';

interface DraggableBlockListProps {
  blocks: Block[];
  onReorder: (blocks: Block[]) => void;
  renderBlock: (block: Block) => React.ReactNode;
}

export function DraggableBlockList({ blocks, onReorder, renderBlock }: DraggableBlockListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over?.id);
      
      const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
        ...block,
        position: index + 1
      }));
      
      onReorder(reorderedBlocks);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {blocks.map((block) => (
            <SortableBlockItem key={block.id} block={block}>
              {renderBlock(block)}
            </SortableBlockItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

interface SortableBlockItemProps {
  block: Block;
  children: React.ReactNode;
}

function SortableBlockItem({ block, children }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "z-50 opacity-50"
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="p-1 bg-white rounded shadow-md border">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      {/* Block Content */}
      <div className="pl-8">
        {children}
      </div>
    </div>
  );
}