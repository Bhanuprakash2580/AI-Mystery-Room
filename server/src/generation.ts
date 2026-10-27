import { GeminiProvider } from './ai/provider.js';
import { MysteryCase } from './models.js';
import type { Blueprint, Evidence, MysteryInput } from './types.js';

const validTypes=new Set(['chat','image','audio','document','statement','timeline']);
function validate(blueprint:Blueprint,evidence:Evidence[],expectedSuspectCount:number){
  if(blueprint.suspects.length!==expectedSuspectCount)throw new Error('INVALID_SUSPECT_COUNT');
  if(!blueprint.suspects.some(s=>s.id===blueprint.culpritId))throw new Error('CULPRIT_NOT_IN_SUSPECTS');
  if(new Set(blueprint.suspects.map(s=>s.id)).size!==blueprint.suspects.length||new Set(blueprint.suspects.map(s=>s.name.toLowerCase())).size!==blueprint.suspects.length)throw new Error('DUPLICATE_SUSPECT');
  const ids=new Set(blueprint.suspects.map(s=>s.id));const factIds=new Set(blueprint.facts.map(f=>f.id));const eids=new Set<string>();
  if(factIds.size!==blueprint.facts.length)throw new Error('DUPLICATE_FACT');
  if(evidence.length<8||evidence.length>15)throw new Error('INVALID_EVIDENCE_COUNT');
  const evidenceTypes=new Set(evidence.map(item=>item.type));
  if(evidenceTypes.size<2||!evidence.some(item=>['chat','document','statement','timeline'].includes(item.type)))throw new Error('INSUFFICIENT_EVIDENCE_CATEGORIES');
  for(const item of evidence){
    if(eids.has(item.id)||!validTypes.has(item.type))throw new Error('INVALID_EVIDENCE');eids.add(item.id);
    if(item.relatedSuspectIds.some(id=>!ids.has(id)))throw new Error('UNKNOWN_SUSPECT_REFERENCE');
    if([...item.validation.supportedFactIds,...item.validation.contradictedFactIds].some(id=>!factIds.has(id)))throw new Error('UNKNOWN_FACT_REFERENCE');
    if(item.occurredAt&&Number.isNaN(Date.parse(item.occurredAt)))throw new Error('INVALID_EVIDENCE_TIMESTAMP');
    if(item.type==='chat'){
      const messages=item.content.messages;
      if(!Array.isArray(messages)||messages.length<2||messages.some((m:any)=>typeof m.sender!=='string'||typeof m.text!=='string'||typeof m.time!=='string'))throw new Error('INVALID_CHAT_CONTENT');
      const names=new Set(blueprint.suspects.map(s=>s.name));
      if(messages.some((m:any)=>!names.has(m.sender)))throw new Error('UNKNOWN_CHAT_PARTICIPANT');
    }else if(typeof item.content.body!=='string'||!item.content.body.trim())throw new Error('MISSING_EVIDENCE_BODY');
  }
  const solutionEvidence=evidence.filter(e=>e.validation.supportedFactIds.length&&e.relatedSuspectIds.includes(blueprint.culpritId));
  const contradictions=evidence.filter(e=>e.validation.contradictedFactIds.length&&e.relatedSuspectIds.includes(blueprint.culpritId));
  const redHerrings=evidence.filter(e=>e.validation.isRedHerring);
  if(solutionEvidence.length<3||contradictions.length<2||redHerrings.length<2)throw new Error('INSUFFICIENT_SOLVABILITY_EVIDENCE');
  if(blueprint.suspects.some(s=>!evidence.some(e=>e.relatedSuspectIds.includes(s.id))))throw new Error('SUSPECT_WITHOUT_EVIDENCE');
  if(!blueprint.explanation||!blueprint.motive)throw new Error('MISSING_SOLUTION');
}
export async function generateCase(caseId:string,input:MysteryInput){
  let lastError:unknown;
  for(let attempt=1;attempt<=2;attempt++)try{
    await MysteryCase.findByIdAndUpdate(caseId,{status:'generating',generationStage:'Interpreting your scenario',generationErrorCode:null});
    const provider=new GeminiProvider();const blueprint=await provider.generateBlueprint(input);
    await MysteryCase.findByIdAndUpdate(caseId,{status:'generating',title:blueprint.title,generationStage:'Generating evidence'});
    const evidence=await provider.generateEvidence(blueprint,input);
    await MysteryCase.findByIdAndUpdate(caseId,{status:'validating',generationStage:'Checking clues and contradictions'});
    validate(blueprint,evidence,input.suspectCount);
    const publicCaseData={summary:blueprint.summary,incident:blueprint.incident,location:blueprint.location,incidentTime:blueprint.incidentTime,objective:blueprint.objective,suspects:blueprint.suspects};
    const safeEvidence=evidence.map(({validation,...publicItem})=>publicItem);
    const solution={culpritId:blueprint.culpritId,motive:blueprint.motive,timeline:blueprint.timeline,explanation:blueprint.explanation,facts:blueprint.facts,validationEvidence:evidence.map(e=>({id:e.id,...e.validation}))};
    await MysteryCase.findByIdAndUpdate(caseId,{title:blueprint.title,publicCaseData,solution,evidence:safeEvidence,status:'playable',generationStage:'Case room ready',generationErrorCode:null});return;
  }catch(error){lastError=error;if(attempt===2)break;}
  const code=lastError instanceof Error?lastError.message:'GENERATION_FAILED';
  await MysteryCase.findByIdAndUpdate(caseId,{status:'failed',generationStage:'Generation failed',generationErrorCode:code==='AI_PROVIDER_NOT_CONFIGURED'?'AI_PROVIDER_NOT_CONFIGURED':'CASE_GENERATION_FAILED'});
}
