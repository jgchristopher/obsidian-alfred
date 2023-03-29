import { EphemeralState } from 'obsidian';
import { EmbeddedViewParent } from '../search/leafView';

interface OpenViewState {
	eState?: EphemeralState;
	state?: { mode: string };
	active?: boolean;
}

declare global {
	const i18next: {
		t(id: string): string;
	};
	interface Window {
		activeWindow: Window;
		activeDocument: Document;
	}
}

declare module 'obsidian' {
	interface App {
		commands: {
			listCommands(): Command[];
			findCommand(id: string): Command;
			removeCommand(id: string): void;
			executeCommandById(id: string): void;
			commands: Record<string, Command>;
		};
		dom: { appContainerEl: HTMLElement };
		viewRegistry: ViewRegistry;
		openWithDefaultApp(path: string): void;
	}
	interface ViewRegistry {
		typeByExtension: Record<string, string>; // file extensions to view types
		viewByType: Record<string, (leaf: WorkspaceLeaf) => View>; // file extensions to view types
	}

	interface WorkspaceLeaf {
		openLinkText(
			linkText: string,
			path: string,
			state?: unknown
		): Promise<void>;
		updateHeader(): void;
		containerEl: HTMLDivElement;
		working: boolean;
		parentSplit: WorkspaceParent;
		activeTime: number;
	}
	interface Workspace {
		recordHistory(leaf: WorkspaceLeaf, pushHistory: boolean): void;
		iterateLeaves(
			callback: (item: WorkspaceLeaf) => boolean | void,
			item: WorkspaceItem | WorkspaceItem[]
		): boolean;
		iterateLeaves(
			item: WorkspaceItem | WorkspaceItem[],
			callback: (item: WorkspaceLeaf) => boolean | void
		): boolean;
		getDropLocation(event: MouseEvent): {
			target: WorkspaceItem;
			sidedock: boolean;
		};
		recursiveGetTarget(
			event: MouseEvent,
			parent: WorkspaceParent
		): WorkspaceItem;
		recordMostRecentOpenedFile(file: TFile): void;
		onDragLeaf(event: MouseEvent, leaf: WorkspaceLeaf): void;
		onLayoutChange(): void; // tell Obsidian leaves have been added/removed/etc.
		activeLeafEvents(): void;
		floatingSplit: any;
	}

	interface View {
		iconEl: HTMLElement;
		file: TFile;
		setMode(mode: MarkdownSubView): Promise<void>;
		followLinkUnderCursor(newLeaf: boolean): void;
		modes: Record<string, MarkdownSubView>;
		getMode(): string;
		headerEl: HTMLElement;
		contentEl: HTMLElement;
	}

	interface SearchView extends View {
		onKeyArrowRightInFocus(e: KeyboardEvent): void;
		onKeyArrowLeftInFocus(e: KeyboardEvent): void;
		onKeyArrowUpInFocus(e: KeyboardEvent): void;
		onKeyArrowDownInFocus(e: KeyboardEvent): void;
		onKeyEnterInFocus(e: KeyboardEvent): void;
		onKeyShowMoreBefore(e: KeyboardEvent): void;
		onKeyShowMoreAfter(e: KeyboardEvent): void;
		dom: any;
		searchComponent: SearchComponent;
		headerDom: any;
	}

	interface WorkspaceParent {
		insertChild(index: number, child: WorkspaceItem, resize?: boolean): void;
		replaceChild(index: number, child: WorkspaceItem, resize?: boolean): void;
		removeChild(leaf: WorkspaceLeaf, resize?: boolean): void;
		containerEl: HTMLElement;
		children: any;
	}

	interface MarkdownEditView {
		editorEl: HTMLElement;
	}

	interface FileManager {
		createNewMarkdownFile(folder: TFolder, fileName: string): Promise<TFile>;
	}

	enum PopoverState {
		Showing,
		Shown,
		Hiding,
		Hidden,
	}

	interface EphemeralState {
		focus?: boolean;
		subpath?: string;
		line?: number;
		startLoc?: Loc;
		endLoc?: Loc;
		scroll?: number;
	}
	interface HoverParent {
		type?: string;
	}
	interface HoverPopover {
		parent: EmbeddedViewParent | null;
		targetEl: HTMLElement;
		hoverEl: HTMLElement;
		position(pos?: MousePos): void;
		hide(): void;
		show(): void;
		shouldShowSelf(): boolean;
		timer: number;
		waitTime: number;
		shouldShow(): boolean;
		transition(): void;
	}
	interface MousePos {
		x: number;
		y: number;
	}

	interface Plugin {
		registerGlobalCommand(command: Command): void;
	}
}
