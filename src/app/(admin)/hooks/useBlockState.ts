import { useState, useCallback, useEffect } from "react";
import { Block, BlockType } from "../types";
import { BLOCKS } from "@/src/components/blocks";

const STORAGE_KEY = "page-builder-blocks";

export function useBlockState(
  initialBlocks: Block[] = [],
  disableLocalStorage = false
) {
  const [blocks, setBlocks] = useState<Block[]>(() =>
    disableLocalStorage
      ? Array.isArray(initialBlocks)
        ? initialBlocks
        : []
      : []
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (disableLocalStorage) {
      setBlocks(Array.isArray(initialBlocks) ? initialBlocks : []);
      setIsHydrated(true);
      return;
    }
    const savedBlocks = localStorage.getItem(STORAGE_KEY);
    if (savedBlocks) {
      try {
        const parsedBlocks = JSON.parse(savedBlocks);
        setBlocks(Array.isArray(parsedBlocks) ? parsedBlocks : []);
      } catch (e) {
        setBlocks([]);
      }
    } else {
      setBlocks(Array.isArray(initialBlocks) ? initialBlocks : []);
    }
    setIsHydrated(true);
  }, [initialBlocks, disableLocalStorage]);

  // Optimize localStorage save to avoid unnecessary updates
  useEffect(() => {
    if (disableLocalStorage || !isHydrated) return;

    // Only save to localStorage if blocks have changed
    const currentBlocks = JSON.stringify(blocks);
    const savedBlocks = localStorage.getItem(STORAGE_KEY);
    if (savedBlocks !== currentBlocks && blocks.length > 0) {
      localStorage.setItem(STORAGE_KEY, currentBlocks);
    } else if (blocks.length === 0 && savedBlocks) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [blocks, isHydrated, disableLocalStorage]);

  const addBlock = (type: BlockType, initialData?: Partial<Block>) => {
    const blockDef = BLOCKS[type];
    const schema = blockDef.schema;

    // Get schema-level initial values first
    const schemaInitialValues = (
      typeof schema.initialValue === "object" ? schema.initialValue : {}
    ) as Record<string, any>;

    // Get field-level initial values
    const fieldInitialValues: Record<string, any> = {};
    schema.fields?.forEach((field: any) => {
      if (field.initialValue && !(field.name in (schemaInitialValues || {}))) {
        fieldInitialValues[field.name] = field.initialValue;
      }
    });

    const newBlock: Block = {
      id: Math.random().toString(36).substring(2, 15),
      _type: type,
      ...initialData,
      ...fieldInitialValues,
      ...schemaInitialValues,
    };

    setBlocks((prev) => [...prev, newBlock]);
    return newBlock;
  };

  const updateBlock = (id: string, updatedBlock: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, ...updatedBlock } : block
      )
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const reorderBlocks = (startIndex: number, endIndex: number) => {
    setBlocks((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const clearBlocks = () => {
    setBlocks([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const setBlocksDirect = (blocks: Block[]) => {
    setBlocks(blocks);
    if (disableLocalStorage) return;
    if (blocks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    blocks: Array.isArray(blocks) ? blocks : [],
    addBlock,
    updateBlock,
    removeBlock,
    reorderBlocks,
    clearBlocks,
    setBlocks: setBlocksDirect,
  };
}
