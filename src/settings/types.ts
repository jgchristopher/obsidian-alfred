export const SectionPosition = {
  PREPEND: "prepend",
  APPEND: "append",
} as const;

export type SectionPosition =
  (typeof SectionPosition)[keyof typeof SectionPosition];

export interface ObsidianAlfredSettings {
  timestampFormat: string;
  defaultHeading: string;
  openOnWrite: boolean;
  position: SectionPosition;
  entryTemplateLocation: string;
}

export const DEFAULT_SETTINGS: ObsidianAlfredSettings = {
  defaultHeading: "Daily Log",
  timestampFormat: "HH:mm",
  openOnWrite: false,
  position: SectionPosition.PREPEND,
  entryTemplateLocation: "templates/alfred.md",
};
