import type { CaseRecord, Evidence, Progress, Result, Suspect } from './types';

const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, { ...init, credentials: 'include', headers: { 'Content-Type': 'application/json', ...init?.headers } });
  const body = await response.json();
  if (!response.ok || !body.success) throw new Error(body.error?.message || 'Something went wrong. Please try again.');
  return body.data as T;
}
export const api = {
  cases: () => request<CaseRecord[]>('/cases'),
  create: (body: unknown) => request<{ caseId: string; status: string }>('/cases', { method: 'POST', body: JSON.stringify(body) }),
  getCase: (id: string) => request<CaseRecord>(`/cases/${id}`),
  status: (id: string) => request<CaseRecord>(`/cases/${id}/status`),
  retry: (id: string) => request<{ caseId: string; status: string }>(`/cases/${id}/retry`, { method: 'POST' }),
  remove: (id: string) => request<void>(`/cases/${id}`, { method: 'DELETE' }),
  suspects: (id: string) => request<Suspect[]>(`/cases/${id}/suspects`),
  evidence: (id: string) => request<Evidence[]>(`/cases/${id}/evidence`),
  evidenceItem: (id: string, evidenceId: string) => request<Evidence>(`/cases/${id}/evidence/${evidenceId}`),
  progress: (id: string) => request<Progress>(`/cases/${id}/progress`),
  saveProgress: (id: string, body: Partial<Progress>) => request<Progress>(`/cases/${id}/progress`, { method: 'PATCH', body: JSON.stringify(body) }),
  accuse: (id: string, body: { selectedSuspectId: string; theory: string; citedEvidenceIds: string[] }) => request<{ accusationId: string; isCorrect: boolean; resultUrl: string }>(`/cases/${id}/accusations`, { method: 'POST', body: JSON.stringify(body) }),
  results: (id: string) => request<Result>(`/cases/${id}/results`),
  replay: (id: string) => request<Progress>(`/cases/${id}/replay`, { method: 'POST' }),
};
