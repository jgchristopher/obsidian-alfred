import type { App } from "obsidian";
import { ObsidianAlfredSettings } from "./settings/types";
import { getTemplateContents, applyTemplateTransformations } from "./utils";

export class ClippedData {
  private timeStamp: string;

  constructor(
    private settings: ObsidianAlfredSettings,
    private app: App,
    private data: string
  ) {
    this.settings = settings;
    this.app = app;
    this.timeStamp = window.moment().format(this.settings.timestampFormat);
  }

  public async formattedEntry(template?: string): Promise<string> {
    let formattedData = "";

    if (template && template != "") {
      const rawTemplateContents = await getTemplateContents(this.app, template);
      formattedData = applyTemplateTransformations(
        this.timeStamp,
        this.data,
        rawTemplateContents
      );
    } else {
      formattedData = `- ${this.data}\n\n---`;
    }
    return formattedData;
  }
}
