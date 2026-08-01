type PolicySectionIdType =
	| 'scope'
	| 'community'
	| 'wiki'
	| 'revert'
	| 'report'
	| 'action'
	| 'appeal'
	| 'revision';

interface PolicySection {
	id: PolicySectionIdType;
	title: string;
}

export type { PolicySectionIdType, PolicySection };
