import { useState, useCallback } from "react";

export function useOptimisticBlock<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);

  const updateData = useCallback((updates: Partial<T>) => {
    setData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  return [data, updateData] as const;
}
