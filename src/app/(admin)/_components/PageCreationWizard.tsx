import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  ArrowRight,
  Home,
  FileText,
  Settings,
  Users,
  Sparkles,
} from "lucide-react";

// Import initial values from block schemas
import { heroBlock } from "@/src/components/blocks/HeroBlock/schema";
import { cta } from "@/src/components/blocks/CtaBlock/schema";
import { teamBlock } from "@/src/components/blocks/TeamBlock/schema";

interface PageCreationWizardProps {
  onComplete: (data: {
    pageType: "page" | "homePage";
    slug: string;
    title: string;
    templateBlocks: any[];
  }) => void;
  onCancel: () => void;
}

const TEMPLATES = [
  {
    id: "blank",
    name: "Blank Page",
    description: "Start from scratch with no blocks.",
    icon: FileText,
    blocks: [],
  },
  {
    id: "landing",
    name: "Landing Page",
    description: "A hero section and a call to action.",
    icon: Sparkles,
    blocks: [
      {
        _type: "heroBlock",
        ...heroBlock.fields.reduce(
          (acc, f) =>
            f.initialValue !== undefined
              ? { ...acc, [f.name]: f.initialValue }
              : acc,
          {}
        ),
      },
      {
        _type: "cta",
        ...cta.fields.reduce(
          (acc, f) =>
            f.initialValue !== undefined
              ? { ...acc, [f.name]: f.initialValue }
              : acc,
          {}
        ),
        ...cta.initialValue,
      },
    ],
  },
  {
    id: "team",
    name: "Team/About Page",
    description: "A hero section and a team section.",
    icon: Users,
    blocks: [
      {
        _type: "heroBlock",
        ...heroBlock.fields.reduce(
          (acc, f) =>
            f.initialValue !== undefined
              ? { ...acc, [f.name]: f.initialValue }
              : acc,
          {}
        ),
      },
      {
        _type: "teamBlock",
        ...teamBlock.fields.reduce(
          (acc, f) =>
            f.initialValue !== undefined
              ? { ...acc, [f.name]: f.initialValue }
              : acc,
          {}
        ),
        ...teamBlock.initialValue,
      },
    ],
  },
];

export function PageCreationWizard({
  onComplete,
  onCancel,
}: PageCreationWizardProps) {
  const [step, setStep] = React.useState(1);
  const [pageType, setPageType] = React.useState<"page" | "homePage">("page");
  const [slug, setSlug] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [selectedTemplate, setSelectedTemplate] = React.useState(
    TEMPLATES[0].id
  );

  const handleNext = () => {
    if (step === 1) {
      if (!pageType) return;
    } else if (step === 2) {
      if (!slug) return;
      if (!title) {
        setTitle(slug.split("/").pop()?.replace(/-/g, " ") || "New Page");
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    const template = TEMPLATES.find((t) => t.id === selectedTemplate);
    onComplete({
      pageType,
      slug,
      title,
      templateBlocks: template?.blocks || [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl p-6 bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-white">Create New Page</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-zinc-400">
              <div
                className={`w-2 h-2 rounded-full ${step >= 1 ? "bg-blue-500" : "bg-zinc-700"}`}
              />
              <div
                className={`w-2 h-2 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-zinc-700"}`}
              />
              <div
                className={`w-2 h-2 rounded-full ${step >= 3 ? "bg-blue-500" : "bg-zinc-700"}`}
              />
              <div
                className={`w-2 h-2 rounded-full ${step >= 4 ? "bg-blue-500" : "bg-zinc-700"}`}
              />
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Choose Page Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPageType("page")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  pageType === "page"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <FileText className="w-6 h-6 mb-2 text-zinc-400" />
                <h4 className="text-white font-medium">Regular Page</h4>
                <p className="text-sm text-zinc-400">
                  Create a standard page with custom content
                </p>
              </button>
              <button
                onClick={() => setPageType("homePage")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  pageType === "homePage"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <Home className="w-6 h-6 mb-2 text-zinc-400" />
                <h4 className="text-white font-medium">Home Page</h4>
                <p className="text-sm text-zinc-400">
                  Create the main landing page of your site
                </p>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Page Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Page URL
                </label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={pageType === "homePage" ? "/" : "/about-us"}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <p className="mt-1 text-sm text-zinc-500">
                  {pageType === "homePage"
                    ? "Home page will be accessible at the root URL"
                    : "Enter the URL path for your page"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Page Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter page title"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">
              Choose a Template
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <template.icon className="w-8 h-8 mb-2 text-zinc-400" />
                  <h4 className="text-white font-medium mb-1">
                    {template.name}
                  </h4>
                  <p className="text-xs text-zinc-400 text-center">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Review & Create</h3>
            <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Page Type:</span>
                <span className="text-white">
                  {pageType === "homePage" ? "Home Page" : "Regular Page"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Page Title:</span>
                <span className="text-white">{title}</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Page URL:</span>
                <span className="text-white">{slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Template:</span>
                <span className="text-white">
                  {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800">
          <Button
            variant="ghost"
            onClick={step === 1 ? onCancel : handleBack}
            className="text-zinc-400 hover:text-white"
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <Button
            onClick={step === 4 ? handleSubmit : handleNext}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {step === 4 ? "Create Page" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
