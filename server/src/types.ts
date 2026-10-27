export type Difficulty = 'easy' | 'medium' | 'hard';
export type EvidenceType = 'chat' | 'image' | 'audio' | 'document' | 'statement' | 'timeline';
export interface MysteryInput { premise: string; setting?: string; category: string; difficulty: Difficulty; suspectCount: number; evidenceTypes: EvidenceType[]; }
export interface Suspect { id: string; name: string; role: string; description: string; relationshipToIncident: string; publicMotive?: string; publicAlibi: string; }
export interface Evidence { id: string; title: string; type: EvidenceType; description: string; sourceLabel: string; occurredAt?: string; relatedSuspectIds: string[]; content: Record<string, unknown>; validation: { supportedFactIds: string[]; contradictedFactIds: string[]; narrativePurpose: string; isRedHerring: boolean; }; }
export interface Blueprint { title: string; summary: string; incident: string; location: string; incidentTime: string; objective: string; suspects: Suspect[]; culpritId: string; motive: string; timeline: { time: string; event: string }[]; explanation: string; facts: { id: string; statement: string }[]; }
