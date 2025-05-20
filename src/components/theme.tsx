import { buildLegacyTheme } from "sanity";

const props = {
  "--my-white": "#ffffff",
  "--my-black": "#000000",
  "--my-brand": "#666666",
  "--my-red": "#ff4444",
  "--my-gray": "#666",
  "--my-dark-gray": "#333333",
  "--my-light-gray": "#cccccc",
};

export const Theme = buildLegacyTheme({
  "--black": props["--my-black"],
  "--white": props["--my-white"],
  "--gray": props["--my-gray"],
  "--gray-base": props["--my-gray"],
  "--component-bg": props["--my-black"],
  "--component-text-color": props["--my-white"],
  "--brand-primary": props["--my-brand"],
  "--default-button-color": props["--my-brand"],
  "--default-button-primary-color": props["--my-brand"],
  "--default-button-success-color": props["--my-brand"],
  "--default-button-warning-color": props["--my-brand"],
  "--default-button-danger-color": props["--my-red"],
  "--state-info-color": props["--my-brand"],
  "--state-success-color": props["--my-brand"],
  "--state-warning-color": props["--my-brand"],
  "--state-danger-color": props["--my-red"],
  "--focus-color": props["--my-brand"],
});
