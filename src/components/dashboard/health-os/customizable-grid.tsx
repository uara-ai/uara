"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Check, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { GreetingHeader } from "./greeting-header";

interface DashboardCard {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
}

interface CustomizableGridProps {
  cards: DashboardCard[];
  className?: string;
}

export function CustomizableGrid({ cards, className }: CustomizableGridProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [items, setItems] = useState<DashboardCard[]>(cards);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load layout from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem("dashboard-layout");
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        const reorderedCards = parsedLayout
          .map((id: string) => cards.find((card) => card.id === id))
          .filter(Boolean);
        if (reorderedCards.length > 0) {
          setItems(reorderedCards);
        }
      } catch (error) {
        console.error("Failed to parse saved layout:", error);
      }
    }
  }, [cards]);

  // Save layout to localStorage
  const saveLayout = (newItems: DashboardCard[]) => {
    const layout = newItems.map((item) => item.id);
    localStorage.setItem("dashboard-layout", JSON.stringify(layout));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        saveLayout(newItems);
        return newItems;
      });
    }
  };

  const toggleCustomize = () => {
    setIsCustomizing(!isCustomizing);
  };

  // Generate empty slots for customization mode
  const emptySlots = Array.from({ length: 4 }, (_, i) => ({
    id: `empty-${i}`,
    isEmpty: true,
  }));

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-between items-center">
        <GreetingHeader />
        <Button
          onClick={toggleCustomize}
          variant={isCustomizing ? "default" : "outline"}
          className={cn(
            "flex items-center gap-2 text-sm transition-all duration-200",
            isCustomizing
              ? ""
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          )}
          size="sm"
        >
          {isCustomizing ? (
            <Check className="h-4 w-4" />
          ) : (
            <Settings className="h-4 w-4" />
          )}

          <span className="hidden sm:inline">
            {isCustomizing ? "Save" : "Customize"}
          </span>
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((card) => {
              const CardComponent = card.component;
              return (
                <SortableCard
                  key={card.id}
                  id={card.id}
                  isCustomizing={isCustomizing}
                >
                  <CardComponent {...card.props} />
                </SortableCard>
              );
            })}

            {/* Show empty slots in customize mode */}
            {isCustomizing &&
              emptySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-sm min-h-[200px]"
                >
                  Add Card
                </div>
              ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface SortableCardProps {
  id: string;
  children: React.ReactNode;
  isCustomizing: boolean;
}

function SortableCard({ id, children, isCustomizing }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative group aspect-square min-h-[200px]",
        isCustomizing && "cursor-move",
        isCustomizing && "animate-shake",
        isDragging && "z-50 scale-105 shadow-lg"
      )}
    >
      {children}
    </div>
  );
}
