import { getContext, setContext } from 'svelte';
import type { Snippet } from 'svelte';

// 다이얼로그 내용 snippet은 자신을 닫을 수 있도록 { close }를 받는다.
type DialogContent = Snippet<[{ close: () => void }]>;

// dismissible: false면 ESC 같은 사용자 취소로 닫히지 않는다 (로딩 등 진행 중 표시용).
interface DialogOptions {
	dismissible?: boolean;
}

interface DialogEntry {
	id: number;
	content: DialogContent;
	dismissible: boolean;
}

// 열린 다이얼로그 스택 + context 주입/조회. open이 엔트리를 push하고,
// 네이티브 <dialog>가 top-layer에 쌓여 중첩된다.
class DialogState {
	private static KEY = Symbol('dialog');

	// provider에서 1회: 전역 인스턴스를 만들어 context에 주입한다.
	static provide(): DialogState {
		const instance = new DialogState();
		setContext(DialogState.KEY, instance);
		return instance;
	}

	// 소비처에서: 주입된 인스턴스를 가져온다.
	static use(): DialogState {
		return getContext(DialogState.KEY);
	}

	private seq = 0;
	stack = $state<DialogEntry[]>([]);

	open(content: DialogContent, options: DialogOptions = {}): { close: () => void } {
		const id = ++this.seq;
		this.stack = [...this.stack, { id, content, dismissible: options.dismissible ?? true }];
		return { close: () => this.close(id) };
	}

	close(id: number): void {
		this.stack = this.stack.filter((entry) => entry.id !== id);
	}
}

export { DialogState };
export type { DialogContent, DialogEntry, DialogOptions };
