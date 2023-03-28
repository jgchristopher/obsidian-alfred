declare module "obsidian" {
  interface View {
    file: TFile;
  }
}

export interface Parameters {
  data?: string;
  header?: string;
}
