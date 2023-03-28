import { App, TFile } from "obsidian";
import type { Moment } from "moment";
import { NoteEntry } from "src/abstracts/noteentry";
import type { SectionPosition } from "src/settings/types";
import { ClippedData } from "src/clippeddata";

export abstract class PeriodicNoteEntry extends NoteEntry {
  protected notice: string;

  protected abstract getPeriodicNote(
    moment: Moment,
    allNotes: Record<string, TFile>
  ): TFile;
  protected abstract getAllNotes(): Record<string, TFile>;
  protected abstract waitForNoteCreation(moment: Moment): Promise<TFile>;

  constructor(
    app: App,
    openFileOnWrite: boolean,
    sectionPosition: SectionPosition,
    template: string
  ) {
    super(app, openFileOnWrite, sectionPosition, template);
    this.template = template;
  }

  async writeToPeriodicNote(noteEntry: ClippedData, heading: string) {
    const note = await this.getNote();

    this.handleWrite(
      note.path,
      await noteEntry.formattedEntry(this.template),
      heading
    );
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
