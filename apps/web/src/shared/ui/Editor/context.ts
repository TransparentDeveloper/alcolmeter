import { getContext, setContext } from 'svelte';
import type { EditorState } from './EditorState.svelte';

const KEY = Symbol('editor');

function setEditorContext(state: EditorState): void {
	setContext(KEY, state);
}

function getEditorContext(): EditorState {
	return getContext(KEY);
}

export { setEditorContext, getEditorContext };
