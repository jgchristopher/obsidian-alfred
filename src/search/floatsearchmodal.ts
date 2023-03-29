import { App, Modal, SearchView, TFile, WorkspaceLeaf } from 'obsidian';
import { EmbeddedView, spawnLeafView } from './leafview';
import ObsidianAlfredPlugin from '../main';

export class FloatSearchModal extends Modal {
	private readonly plugin: ObsidianAlfredPlugin;
	private searchEmbeddedView: EmbeddedView;
	private fileEmbeddedView: EmbeddedView;

	searchLeaf: WorkspaceLeaf;
	fileLeaf: WorkspaceLeaf | undefined;

	private cb: (state: any) => void;
	private state: any;

	private fileState: any;

	private searchCtnEl: HTMLElement;
	private instructionsEl: HTMLElement;
	private fileEl: HTMLElement;
	private viewType: string;

	constructor(
		cb: (state: any) => void,
		app: App,
		plugin: ObsidianAlfredPlugin,
		state: any,
		viewType = 'search'
	) {
		super(app);
		this.plugin = plugin;
		this.cb = cb;
		this.state = state;
		this.viewType = viewType;
	}

	async onOpen() {
		const { contentEl, containerEl, modalEl } = this;

		this.searchCtnEl = contentEl.createDiv({
			cls: 'float-search-modal-search-ctn',
		});
		this.instructionsEl = modalEl.createDiv({
			cls: 'float-search-modal-instructions',
		});

		this.initInstructions(this.instructionsEl);
		this.initCss(contentEl, modalEl, containerEl);
		await this.initSearchView(this.searchCtnEl, this.viewType);
		this.initInput();
		this.initContent();
	}

	onClose() {
		const { contentEl } = this;

		this.cb(this.searchLeaf.view.getState());

		this.searchLeaf.detach();
		this.fileLeaf?.detach();
		this.searchEmbeddedView.unload();
		this.fileEmbeddedView?.unload();
		contentEl.empty();
	}

	initInstructions(instructionsEl: HTMLElement) {
		const navigateInstructionsEl = instructionsEl.createDiv({
			cls: 'float-search-modal-instructions-navigate',
		});
		const collapseInstructionsEl = instructionsEl.createDiv({
			cls: 'float-search-modal-instructions-collapse',
		});
		const enterInstructionsEl = instructionsEl.createDiv({
			cls: 'float-search-modal-instructions-enter',
		});
		const altEnterInstructionsEl = instructionsEl.createDiv({
			cls: 'float-search-modal-instructions-alt-enter',
		});

		const tabInstructionsEl = instructionsEl.createDiv({
			cls: 'float-search-modal-instructions-tab',
		});
		const switchInstructionsEl = instructionsEl.createDiv({
			cls: 'float-search-modal-instructions-switch',
		});

		const navigateIconEl = navigateInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-key',
		});
		const navigateTextEl = navigateInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-text',
		});
		navigateIconEl.setText('↑↓');
		navigateTextEl.setText('Navigate');

		const collapseIconEl = collapseInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-key',
		});
		const collapseTextEl = collapseInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-text',
		});
		collapseIconEl.setText('Shift+↑↓');
		collapseTextEl.setText('Collapse/Expand');

		const enterIconEl = enterInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-key',
		});
		const enterTextEl = enterInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-text',
		});
		enterIconEl.setText('↵');
		enterTextEl.setText('Open in background');

		const altEnterIconEl = altEnterInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-key',
		});
		const altEnterTextEl = altEnterInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-text',
		});
		altEnterIconEl.setText('Alt+↵');
		altEnterTextEl.setText('Open File and Close');

		const tabIconEl = tabInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-key',
		});
		const tabTextEl = tabInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-text',
		});
		tabIconEl.setText('Tab/Shift+Tab');
		tabTextEl.setText('Preview/Close Preview');

		const switchIconEl = switchInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-key',
		});
		const switchTextEl = switchInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-text',
		});
		switchIconEl.setText('Ctrl+G');
		switchTextEl.setText('Switch Between Search and File View');

		const clickInstructionsEl = instructionsEl.createDiv({
			cls: 'float-search-modal-instructions-click',
		});
		const clickIconEl = clickInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-key',
		});
		const clickTextEl = clickInstructionsEl.createSpan({
			cls: 'float-search-modal-instructions-text',
		});
		clickIconEl.setText('Alt+Click');
		clickTextEl.setText('Close Modal While In File View');
	}

	initCss(
		contentEl: HTMLElement,
		modalEl: HTMLElement,
		containerEl: HTMLElement
	) {
		contentEl.classList.add('float-search-modal-content');
		modalEl.classList.add('float-search-modal');
		containerEl.classList.add('float-search-modal-container');
	}

	async initSearchView(contentEl: HTMLElement, viewType: string) {
		const [createdLeaf, embeddedView] = spawnLeafView(this.plugin, contentEl);
		this.searchLeaf = createdLeaf;
		this.searchEmbeddedView = embeddedView;

		this.searchLeaf.setPinned(true);
		await this.searchLeaf.setViewState({
			type: 'search',
		});

		setTimeout(async () => {
			await this.searchLeaf.view.setState(this.state, true);
			this.state?.current
				? (
						this.searchLeaf.view as SearchView
				  ).searchComponent.inputEl.setSelectionRange(0, 0)
				: (
						this.searchLeaf.view as SearchView
				  ).searchComponent.inputEl.setSelectionRange(
						this.state?.query?.length,
						this.state?.query?.length
				  );
		}, 0);

		return;
	}

	initInput() {
		const inputEl = this.contentEl.getElementsByTagName('input')[0];
		inputEl.focus();
		inputEl.onkeydown = (e) => {
			const currentView = this.searchLeaf.view as SearchView;
			switch (e.key) {
				case 'ArrowDown':
					if (e.shiftKey) {
						currentView.onKeyShowMoreAfter(e);
						if (currentView.dom.focusedItem) {
							if (currentView.dom.focusedItem.collapsible) {
								currentView.dom.focusedItem.setCollapse(false);
							}
						}
						break;
					} else {
						currentView.onKeyArrowDownInFocus(e);
						break;
					}
				case 'ArrowUp':
					if (e.shiftKey) {
						currentView.onKeyShowMoreBefore(e);
						if (currentView.dom.focusedItem) {
							if (currentView.dom.focusedItem.collapseEl) {
								currentView.dom.focusedItem.setCollapse(true);
							}
						}
						break;
					} else {
						currentView.onKeyArrowUpInFocus(e);
						break;
					}
				case 'ArrowLeft':
					currentView.onKeyArrowLeftInFocus(e);
					break;
				case 'ArrowRight':
					currentView.onKeyArrowRightInFocus(e);
					break;
				case 'Enter':
					currentView.onKeyEnterInFocus(e);
					if (e.altKey && currentView.dom.focusedItem) {
						this.close();
					}
					break;
				case 'Tab':
					e.preventDefault();
					if (e.shiftKey) {
						if (this.fileLeaf) {
							this.fileLeaf?.detach();
							this.fileLeaf = undefined;
							this.fileEmbeddedView?.unload();
							this.modalEl.toggleClass('float-search-width', false);
							this.fileEl.detach();

							break;
						}
					}

					if (currentView.dom.focusedItem) {
						const item = currentView.dom.focusedItem;
						const file =
							item.parent.file instanceof TFile ? item.parent.file : item.file;

						item.parent.file instanceof TFile
							? this.initFileView(file, {
									match: {
										content: item.content,
										matches: item.matches,
									},
							  })
							: this.initFileView(file, undefined);
					}
					break;
				case 'e':
					if (e.ctrlKey) {
						e.preventDefault();
						if (this.fileLeaf) {
							const estate = this.fileLeaf.getViewState();
							estate.state.mode =
								'preview' === estate.state.mode ? 'source' : 'preview';
							this.fileLeaf.setViewState(estate, {
								focus: !0,
							});
							setTimeout(() => {
								(
									this.searchLeaf.view as SearchView
								).searchComponent.inputEl.focus();
							}, 0);
						}
					}
					break;
				case 'g':
					if (this.fileLeaf && e.ctrlKey) {
						e.preventDefault();
						app.workspace.setActiveLeaf(this.fileLeaf, {
							focus: true,
						});
					}
					break;
				case 'C':
					if (e.ctrlKey && e.shiftKey) {
						e.preventDefault();
						const text = currentView.dom.focusedItem.el.innerText;
						navigator.clipboard.writeText(text);
					}
			}
		};
	}

	initContent() {
		const { contentEl } = this;
		contentEl.onclick = (e) => {
			const resultElement = contentEl.getElementsByClassName(
				'search-results-children'
			)[0];
			if (resultElement.children.length < 2) {
				return;
			}

			let targetElement = e.target as HTMLElement | null;

			if (e.altKey || !this.fileLeaf) {
				while (targetElement) {
					if (targetElement.classList.contains('tree-item')) {
						this.close();
						break;
					}
					targetElement = targetElement.parentElement;
				}
				return;
			}

			if (this.fileLeaf) {
				const currentView = this.searchLeaf.view as SearchView;

				if ((this.searchCtnEl as Node).contains(targetElement as Node)) {
					while (targetElement) {
						if (targetElement.classList.contains('tree-item')) {
							break;
						}
						targetElement = targetElement.parentElement;
					}
					if (!targetElement) return;

					const fileInnerEl = targetElement?.getElementsByClassName(
						'tree-item-inner'
					)[0] as HTMLElement;
					const innerText = fileInnerEl.innerText;
					const file = app.metadataCache.getFirstLinkpathDest(innerText, '');

					if (file) {
						const item = currentView.dom.resultDomLookup.get(file);
						currentView.dom.setFocusedItem(item);
						this.initFileView(file, undefined);
						(
							this.searchLeaf.view as SearchView
						).searchComponent.inputEl.focus();
					}
				}

				return;
			}
		};
	}

	async initFileView(file: TFile, state: any) {
		if (this.fileLeaf) {
			await this.fileLeaf.openFile(file, {
				active: false,
				eState: state,
			});

			if (
				this.fileState?.match?.matches[0] === state?.match?.matches[0] &&
				state &&
				this.fileState
			) {
				setTimeout(() => {
					if (this.fileLeaf) {
						app.workspace.setActiveLeaf(this.fileLeaf, {
							focus: true,
						});
					}
				}, 0);
			} else {
				this.fileState = state;
				setTimeout(() => {
					(this.searchLeaf.view as SearchView).searchComponent.inputEl.focus();
				}, 0);
			}

			return;
		}

		const { contentEl } = this;
		this.fileEl = contentEl.createDiv({ cls: 'float-search-modal-file-ctn' });
		this.modalEl.toggleClass('float-search-width', true);
		this.fileEl.onkeydown = (e) => {
			if (e.ctrlKey && e.key === 'g') {
				e.preventDefault();
				e.stopPropagation();

				(this.searchLeaf.view as SearchView).searchComponent.inputEl.focus();
			}

			if (e.key === 'Tab' && e.ctrlKey) {
				e.preventDefault();
				e.stopPropagation();

				(this.searchLeaf.view as SearchView).searchComponent.inputEl.focus();
			}
		};

		if (!this.fileEl) return;

		const [createdLeaf, embeddedView] = spawnLeafView(this.plugin, this.fileEl);
		this.fileLeaf = createdLeaf;
		this.fileEmbeddedView = embeddedView;

		this.fileLeaf.setPinned(true);
		await this.fileLeaf.openFile(file, {
			active: false,
			eState: state,
		});
		this.fileState = state;

		(this.searchLeaf.view as SearchView).searchComponent.inputEl.focus();
	}
}
