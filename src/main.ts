import { App, Plugin, PluginSettingTab } from "obsidian";
import { AlfredCaptureData } from "./alfredcapturedata";
import { DEFAULT_SETTINGS, ObsidianAlfredSettings } from "./settings/types";
import type { Parameters } from "./types";
import { Utility } from "./utils/utility";
import type { SvelteComponent } from "svelte";
import ObsidianAlfredSettingsComponent from "./settings/ObsidianAlfredSettingsComponent.svelte";
import { init } from "./settings/settingsstore";
// Remember to rename these classes and interfaces!

export default class ObsidianAlfredPlugin extends Plugin {
  settings: ObsidianAlfredSettings;

  async onload() {
    await this.loadSettings();

    this.registerObsidianProtocolHandler("obsidian-alfred", async (e) => {
      const parameters = e as unknown as Parameters;

      const data = parameters.data;
      let header = parameters.header;

      Utility.assertNotNull(data);

      if (!header || header === "") {
        header = this.settings.defaultHeading;
      }
      new AlfredCaptureData(this.settings, this.app, data).writeToNote(header);
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new ObsidianAlfredSettingsTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class ObsidianAlfredSettingsTab extends PluginSettingTab {
  plugin: ObsidianAlfredPlugin;
  private view: SvelteComponent;

  constructor(app: App, plugin: ObsidianAlfredPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    init(this.plugin);
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    this.view = new ObsidianAlfredSettingsComponent({
      target: containerEl,
      props: {
        app: this.app,
      },
    });
  }

  async hide() {
    super.hide();
    this.view.$destroy();
  }
}
