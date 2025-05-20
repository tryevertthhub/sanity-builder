import { DeviceType } from "../types";

interface DeviceFrameProps {
  children: React.ReactNode;
  device: DeviceType;
  showDeviceFrame: boolean;
}

const frameStyles = {
  mobile: {
    width: "375px",
    height: "812px",
    borderRadius: "44px",
    padding: "20px",
  },
  tablet: {
    width: "768px",
    height: "1024px",
    borderRadius: "24px",
    padding: "20px",
  },
  laptop: {
    width: "1024px",
    height: "640px",
    borderRadius: "8px",
    padding: "24px",
  },
} as const;

export function DeviceFrame({
  children,
  device,
  showDeviceFrame,
}: DeviceFrameProps) {
  // Only render children directly if device frame is disabled or in desktop mode
  if (!showDeviceFrame || device === "desktop") {
    return <div className="h-full overflow-y-auto">{children}</div>;
  }

  return (
    <div className="flex items-center justify-center mt-12">
      <div
        className="bg-zinc-900 shadow-2xl relative"
        style={frameStyles[device]}
      >
        <div
          className="absolute inset-0 border border-zinc-800 pointer-events-none"
          style={{ borderRadius: frameStyles[device].borderRadius }}
        />
        {device === "mobile" && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-6 z-100 bg-zinc-800 rounded-full" />
        )}
        <div className="w-full h-full overflow-y-auto bg-black rounded-2xl">
          <div className="min-h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
