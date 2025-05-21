import React from "react";
import { Plus, X, Save, Sliders } from "lucide-react";
import { BLOCKS } from "@/src/components/blocks";
import { Block, SchemaField } from "../types";

// Helper function to generate unique keys
const generateKey = (length = 12) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

type SchemaEditorProps = {
  block: Block;
  onClose: () => void;
  onSave: (block: Block) => void;
};

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: any[];
  onChange: (value: any[]) => void;
}) => {
  const [text, setText] = React.useState(value?.[0]?.children?.[0]?.text || "");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange([
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: newText,
          },
        ],
      },
    ]);
  };

  return (
    <textarea
      value={text}
      onChange={handleTextChange}
      rows={4}
      className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      placeholder="Enter text here..."
    />
  );
};

const ButtonsEditor = ({
  value,
  onChange,
}: {
  value: any[];
  onChange: (value: any[]) => void;
}) => {
  const [buttons, setButtons] = React.useState(value || []);

  const addButton = () => {
    const newButton = {
      _key: generateKey(),
      text: "New Button",
      variant: "default",
      href: "#",
      openInNewTab: false,
    };
    const newButtons = [...buttons, newButton];
    setButtons(newButtons);
    onChange(newButtons);
  };

  const updateButton = (index: number, field: string, value: any) => {
    const newButtons = buttons.map((button, i) => {
      if (i === index) {
        return { ...button, [field]: value };
      }
      return button;
    });
    setButtons(newButtons);
    onChange(newButtons);
  };

  const removeButton = (index: number) => {
    const newButtons = buttons.filter((_, i) => i !== index);
    setButtons(newButtons);
    onChange(newButtons);
  };

  return (
    <div className="space-y-4">
      {buttons.map((button, index) => (
        <div
          key={button._key}
          className="p-4 bg-zinc-800/50 rounded-lg space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">
              Button {index + 1}
            </h4>
            <button
              onClick={() => removeButton(index)}
              className="p-1 hover:bg-zinc-700/50 rounded text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Text
              </label>
              <input
                type="text"
                value={button.text}
                onChange={(e) => updateButton(index, "label", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Variant
              </label>
              <select
                value={button.variant}
                onChange={(e) => updateButton(index, "variant", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="default">Default</option>
                <option value="outline">Outline</option>
                <option value="secondary">Secondary</option>
                <option value="link">Link</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Link URL
              </label>
              <input
                type="text"
                value={button.link?.href}
                onChange={(e) =>
                  updateButton(index, "link.href", e.target.value)
                }
                className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`openInNewTab-${index}`}
                checked={button.link?.openInNewTab}
                onChange={(e) =>
                  updateButton(index, "link.openInNewTab", e.target.checked)
                }
                className="rounded border-zinc-700 bg-zinc-800/50 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <label
                htmlFor={`openInNewTab-${index}`}
                className="text-xs font-medium text-zinc-400"
              >
                Open in new tab
              </label>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addButton}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-all"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">Add Button</span>
      </button>
    </div>
  );
};

export function SchemaEditor({ block, onClose, onSave }: SchemaEditorProps) {
  const blockSchema = BLOCKS[block.type].schema;
  const [values, setValues] = React.useState<any>(block);

  const handleChange = (fieldName: string, value: any) => {
    setValues((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSave = () => {
    onSave({ ...block, ...values });
    onClose();
  };

  const renderField = (field: SchemaField) => {
    switch (field.type) {
      case "string":
        return (
          <input
            type="text"
            value={values[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        );

      case "richText":
        return (
          <RichTextEditor
            value={values[field.name] || []}
            onChange={(value) => handleChange(field.name, value)}
          />
        );

      case "array":
        if (field.name === "buttons") {
          return (
            <ButtonsEditor
              value={values[field.name] || []}
              onChange={(value) => handleChange(field.name, value)}
            />
          );
        }
        return null;

      case "object":
        return (
          <div className="space-y-4">
            {field.fields?.map((subField) => (
              <div key={subField.name}>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  {subField.title}
                </label>
                {renderField(subField)}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-medium text-white">
              Edit {blockSchema.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {blockSchema.fields?.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                {field.title}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
