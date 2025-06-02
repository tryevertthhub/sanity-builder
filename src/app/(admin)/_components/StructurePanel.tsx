import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  LayoutPanelLeft,
  Move,
  Settings,
  X,
  Layers,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { BLOCK_COMPONENTS } from "@/src/components/blocks";
import { Button } from "@/src/components/ui/button";
import { Block } from "../types";

interface StructurePanelProps {
  className?: string;
  selectedBlocks: Block[];
  onDragEnd: (result: any) => void;
  onRemoveBlock: (id: string) => void;
  onReset?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

export function StructurePanel({
  className = "",
  selectedBlocks,
  onDragEnd,
  onRemoveBlock,
  onReset,
  onDelete,
  isEditing = false,
}: StructurePanelProps) {
  // Filter out null/undefined blocks and ensure they have required properties
  const validBlocks = selectedBlocks.filter((block): block is Block => {
    if (block === null || block === undefined) return false;
    const hasId = typeof (block.id || block._key) === "string";
    const hasType = typeof (block.type || block._type) === "string";
    return hasId && hasType;
  });

  return (
    <div className={`${className} flex flex-col h-full`}>
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 rounded-t-2xl shadow-md">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-wide">
          <LayoutPanelLeft className="w-5 h-5 text-blue-400" />
          Page Structure
        </h2>
        {isEditing && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-zinc-400 hover:text-orange-400"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset Page
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-zinc-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Page
            </Button>
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto bg-zinc-900/70 rounded-b-2xl"
            >
              {validBlocks.map((block, index) => {
                const blockId = block.id || block._key || "";
                const blockType = block.type || block._type || "";
                const blockComponent = BLOCK_COMPONENTS[blockType];

                if (!blockComponent) {
                  console.warn(
                    `No component found for block type: ${blockType}`
                  );
                  return null;
                }

                return (
                  <Draggable key={blockId} draggableId={blockId} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group relative bg-zinc-800/80 rounded-xl p-4 border-2 ${
                          snapshot.isDragging
                            ? "border-blue-500/70 ring-2 ring-blue-500/30 shadow-xl"
                            : "border-zinc-700/60 shadow-md"
                        } transition-all duration-200 hover:border-blue-400/60 hover:shadow-lg flex items-center gap-3`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab text-blue-400 hover:text-blue-300 transition-colors mr-2"
                          title="Drag to reorder"
                        >
                          <Move className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-white truncate flex items-center gap-1">
                            {blockComponent.name}
                            <span className="text-xs text-zinc-500 font-normal">
                              #{index + 1}
                            </span>
                          </h3>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">
                            {block.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            className="p-2 rounded-lg hover:bg-zinc-700/60 text-zinc-400 hover:text-white transition-all"
                            title="Block settings"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRemoveBlock(blockId)}
                            className="p-2 rounded-lg hover:bg-red-700/60 text-zinc-400 hover:text-red-400 transition-all"
                            title="Remove block"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/* 
      {selectedBlocks.length === 0 && (
        <div className="flex-1 flex items-center h-full flex flex-col justify-center p-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/50 mb-4">
            <Layers className="w-6 h-6 text-zinc-400" />
          </div>
          <p className="text-sm text-zinc-400 max-w-[200px] mx-auto">
            Select blocks from the library to begin building your page
          </p>
        </div>
      )} */}
    </div>
  );
}
