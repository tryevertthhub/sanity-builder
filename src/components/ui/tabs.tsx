import React from "react";

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  value: string;
  setValue: (value: string) => void;
}>({
  value: "",
  setValue: () => {},
});

export function Tabs({ defaultValue, className = "", children }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className = "", children }: TabsListProps) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-zinc-800/50 p-1 text-zinc-400 ${className}`}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className = "",
  children,
}: TabsTriggerProps) {
  const { value: selectedValue, setValue } = React.useContext(TabsContext);
  const isSelected = value === selectedValue;

  return (
    <button
      onClick={() => setValue(value)}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium
        transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50
        ${isSelected ? "bg-white text-zinc-900" : "hover:bg-zinc-800/50 hover:text-white"}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className = "",
  children,
}: TabsContentProps) {
  const { value: selectedValue } = React.useContext(TabsContext);

  if (value !== selectedValue) {
    return null;
  }

  return <div className={`mt-2 ${className}`}>{children}</div>;
}
