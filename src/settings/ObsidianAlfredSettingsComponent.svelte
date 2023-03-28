<script lang="ts">
  import type { App } from "obsidian";
  import Suggest from "./components/Suggest.svelte";
  import { settings } from "./settingsstore";

  export let app: App;
  const onChange = (entry: string) => {
    $settings.entryTemplateLocation = entry;
  };
</script>

<div class="clp_section_margin">
  <div class="setting-item">
    <div class="setting-item-info">
      <div class="setting-item-name">Note Header</div>
      <div class="setting-item-description">
        What header should highlight data be appended/prepended under?
      </div>
    </div>
    <div class="setting-item-control">
      <input
        type="text"
        bind:value={$settings.defaultHeading}
        spellcheck="false"
        placeholder=""
      />
    </div>
  </div>
  <div class="setting-item">
    <div class="setting-item-info">
      <div class="setting-item-name">Note Position</div>
      <div class="setting-item-description">
        Would you like to prepend clippings to the top of the section or append
        them to the bottom of the section?
      </div>
    </div>
    <div class="setting-item-control">
      <select class="dropdown" bind:value={$settings.position}>
        <option value="prepend">prepend</option>
        <option value="append">append</option>
      </select>
    </div>
  </div>
  <div class="setting-item">
    <div class="setting-item-info">
      <div class="setting-item-name">Open File After Adding Entry?</div>
      <div class="setting-item-description">
        Would you like to open the note after adding the clipping?
      </div>
    </div>
    <div class="setting-item-control">
      <select class="dropdown" bind:value={$settings.openOnWrite}>
        <option value={true}>Yes</option>
        <option value={false}>No</option>
      </select>
    </div>
  </div>
  <Suggest
    name="Entry Template"
    description="Choose the file to use as a template for the entry"
    initialValue={$settings.entryTemplateLocation}
    dataProvider={() => app.vault.getMarkdownFiles()}
    {onChange}
  />
</div>
