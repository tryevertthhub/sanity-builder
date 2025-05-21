import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { LayoutPanelLeft, Move, Settings, X, Layers } from "lucide-react";
import { BLOCK_COMPONENTS } from "@/src/components/blocks";

interface Block {
  id?: string;
  type?: string;
  _key?: string;
  _type?: string;
  title?: string;
  [key: string]: any;
}

interface StructurePanelProps {
  className?: string;
  selectedBlocks: Block[];
  onDragEnd: (result: any) => void;
  onRemoveBlock: (id: string) => void;
}

export function StructurePanel({
  className = "",
  selectedBlocks,
  onDragEnd,
  onRemoveBlock,
}: StructurePanelProps) {
  // Filter out null/undefined blocks and ensure they have required properties
  const validBlocks = selectedBlocks.filter((block): block is Block => {
    if (block === null || block === undefined) return false;
    const hasId = typeof (block.id || block._key) === 'string';
    const hasType = typeof (block.type || block._type) === 'string';
    return hasId && hasType;
  });

  return (
    <div className={`${className} flex flex-col h-full  `}>
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <LayoutPanelLeft className="w-5 h-5 text-zinc-400" />
          Page Structure
        </h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex-1 p-4 space-y-2 overflow-y-auto"
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
                        className={`group relative bg-zinc-800/50 rounded-lg p-3 border ${
                          snapshot.isDragging
                            ? "border-blue-500/50 ring-2 ring-blue-500/20"
                            : "border-zinc-700/50"
                        } transition-all duration-200`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move text-zinc-400 hover:text-white transition-colors"
                          >
                            <Move className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white truncate flex items-center gap-1">
                              {blockComponent.name}
                              <span className="text-xs text-zinc-500">
                                #{index + 1}
                              </span>
                            </h3>
                            <p className="text-xs text-zinc-400 truncate mt-0.5">
                              {block.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                              title="Block settings"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRemoveBlock(blockId)}
                              className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                              title="Remove block"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
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
