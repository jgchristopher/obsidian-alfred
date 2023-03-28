import { App } from "obsidian";
import { ClippedData } from "./clippeddata";
import { DailyPeriodicNoteEntry } from "./periodicnotes/dailyperiodicnoteentry";
import { ObsidianAlfredSettings } from "./settings/types";

export class AlfredCaptureData {
  private noteData: ClippedData;
  constructor(
    private settings: ObsidianAlfredSettings,
    private app: App,
    data: string
  ) {
    this.noteData = new ClippedData(this.settings, this.app, data);
  }

  public writeToNote(heading: string) {
    new DailyPeriodicNoteEntry(
      this.app,
      this.settings.openOnWrite,
      this.settings.position,
      this.settings.entryTemplateLocation
    ).writeToPeriodicNote(this.noteData, heading);
  }
}
