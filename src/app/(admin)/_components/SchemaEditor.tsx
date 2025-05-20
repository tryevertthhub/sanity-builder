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

      case "image":
        const imageValue = values[field.name] || {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: "image-562b78c6069e30f25c9c6484c1ea831ac5a16aaa-1600x900-jpg",
          },
        };

        return (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800/50 rounded-lg space-y-4">
              {imageValue?.asset?._ref && (
                <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                  <img
                    src={`https://cdn.sanity.io/images/your-project-id/production/${imageValue.asset._ref.replace("image-", "").replace("-jpg", ".jpg")}`}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleChange(field.name, {
                      _type: "image",
                      asset: {
                        _type: "reference",
                        _ref: "image-562b78c6069e30f25c9c6484c1ea831ac5a16aaa-1600x900-jpg",
                      },
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Choose Image</span>
                </button>

                {imageValue?.asset?._ref && (
                  <button
                    onClick={() => handleChange(field.name, null)}
                    className="p-2 hover:bg-zinc-700/50 rounded text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="text-xs text-zinc-500">
                {field.description || "Select an image to use in this block"}
              </div>
            </div>

            <details className="group">
              <summary className="text-xs text-zinc-500 hover:text-zinc-400 cursor-pointer">
                Show raw data
              </summary>
              <div className="mt-2 p-2 bg-zinc-800/50 rounded border border-zinc-700/50">
                <pre className="text-xs text-zinc-400 overflow-auto">
                  {JSON.stringify(imageValue, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={values[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        );
    }
  };

  return (
    <div className="min-w-[600px] border-l border-zinc-800 bg-zinc-900/95 backdrop-blur-xl flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-zinc-400" />
          Edit {block.type}
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {blockSchema.fields?.map((field: SchemaField) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                {field.title || field.name}
                {field.description && (
                  <span className="ml-2 text-xs text-zinc-500">
                    {field.description}
                  </span>
                )}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
