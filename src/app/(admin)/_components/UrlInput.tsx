import React from "react";
import { Globe } from "lucide-react";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onTypeChange: (type: "page" | "homePage") => void;
}

export const UrlInput = React.memo(
  ({ value, onChange, onTypeChange }: UrlInputProps) => {
    // Use local state to handle input value
    const [inputValue, setInputValue] = React.useState(value);

    // Update local state when parent value changes
    React.useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      // Always ensure leading slash for display
      if (newValue && !newValue.startsWith("/")) {
        newValue = `/${newValue}`;
      }
      setInputValue(newValue);

      // If it's just "/" then it's homepage
      if (newValue === "/") {
        onTypeChange("homePage");
      } else {
        onTypeChange("page");
      }
    };

    const handleBlur = () => {
      // Ensure consistent format when updating parent
      let newValue = inputValue;
      if (newValue && !newValue.startsWith("/")) {
        newValue = `/${newValue}`;
      }
      // If empty or just whitespace, default to "/"
      if (!newValue.trim()) {
        newValue = "/";
        onTypeChange("homePage");
      }
      onChange(newValue);
    };

    return (
      <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2.5 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-400">Page URL:</span>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="/ (homepage) or /about"
            className="w-48 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-0"
            autoComplete="off"
          />
        </div>
        {inputValue === "/" && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
            Homepage
          </span>
        )}
      </div>
    );
  },
);
