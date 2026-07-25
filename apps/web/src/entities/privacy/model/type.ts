type PrivacySectionIdType =
	| 'overview'
	| 'items'
	| 'purpose'
	| 'processors'
	| 'retention'
	| 'rights'
	| 'cookies'
	| 'contact';

interface PrivacySection {
	id: PrivacySectionIdType;
	title: string;
}

export type { PrivacySectionIdType, PrivacySection };
