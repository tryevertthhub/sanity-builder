import { Check } from "lucide-react";

export const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-white mb-2">
            Creating your page
          </h3>
          <p className="text-sm text-zinc-400">
            This will only take a moment...
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const SuccessOverlay = ({ url }: { url: string }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
          <Check className="w-6 h-6 text-green-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-white mb-2">
            Page created successfully!
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Redirecting you to your new page...
          </p>
          <div className="px-3 py-2 bg-zinc-800 rounded text-sm font-mono text-zinc-300">
            {url}
          </div>
        </div>
      </div>
    </div>
  </div>
);
