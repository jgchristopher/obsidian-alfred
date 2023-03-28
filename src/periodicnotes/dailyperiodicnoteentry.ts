import type { SectionPosition } from "../settings/types";
import type { Moment } from "moment";
import { App, TFile } from "obsidian";
import {
  createDailyNote,
  getAllDailyNotes,
  getDailyNote,
} from "obsidian-daily-notes-interface";
import { NoteEntry } from "src/abstracts/noteentry";
import { ClippedData } from "src/clippeddata";

export class DailyPeriodicNoteEntry extends NoteEntry {
  constructor(
    app: App,
    openFileOnWrite: boolean,
    sectionPosition: SectionPosition,
    template: string
  ) {
    super(app, openFileOnWrite, sectionPosition, template);
  }

  async writeToPeriodicNote(noteEntry: ClippedData, heading: string) {
    const note = await this.getNote();

    this.handleWrite(
      note.path,
      await noteEntry.formattedEntry(this.template),
      heading
    );
  }

  protected getPeriodicNote(moment: Moment, allNotes: Record<string, TFile>) {
    return getDailyNote(moment, allNotes);
  }

  protected async waitForNoteCreation(moment: Moment) {
    const dailyNote = await createDailyNote(moment);
    await new Promise((r) => setTimeout(r, 50));
    return dailyNote;
  }

  protected getAllNotes() {
    return getAllDailyNotes();
  }

  protected async getNote() {
    const now = globalThis.moment();
    const allNotes = this.getAllNotes();
    const periodicNote = this.getPeriodicNote(now, allNotes);
    if (!periodicNote) {
      return await this.waitForNoteCreation(now);
    }
    return periodicNote;
  }
}
