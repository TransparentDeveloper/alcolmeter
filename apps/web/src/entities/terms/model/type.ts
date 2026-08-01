type TermsSectionIdType =
	| 'purpose'
	| 'service'
	| 'account'
	| 'content'
	| 'prohibited'
	| 'moderation'
	| 'changes'
	| 'disclaimer'
	| 'privacy'
	| 'revision'
	| 'governing';

interface TermsSection {
	id: TermsSectionIdType;
	title: string;
}

export type { TermsSectionIdType, TermsSection };
