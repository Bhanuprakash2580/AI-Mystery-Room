import mongoose, { Schema } from 'mongoose';

const caseSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, default: null }, sessionId: { type: String, required: true, index: true },
  title: { type: String, default: 'Untitled case' }, premise: { type: String, required: true }, setting: String,
  category: { type: String, required: true }, difficulty: { type: String, enum: ['easy','medium','hard'], required: true }, suspectCount: {type:Number,default:4}, evidenceTypes: [String],
  status: { type: String, enum: ['queued','generating','validating','playable','failed','completed'], default: 'queued', index: true }, generationStage: String, generationErrorCode: String,
  publicCaseData: { type: Schema.Types.Mixed, default: {} }, solution: { type: Schema.Types.Mixed, default: {} }, evidence: { type: [Schema.Types.Mixed], default: [] },
  promptVersion: { type: String, default: 'blueprint.v1/evidence.v1' }, schemaVersion: { type: Number, default: 1 }, completedAt: Date,
}, { timestamps: true, minimize: false });
caseSchema.index({ sessionId: 1, createdAt: -1 });
export const MysteryCase = mongoose.model('MysteryCase', caseSchema);

const progressSchema = new Schema({ caseId: { type: Schema.Types.ObjectId, required: true }, sessionId: { type: String, required: true }, viewedEvidenceIds: { type: [String], default: [] }, bookmarkedEvidenceIds: { type: [String], default: [] }, notes: { type: String, default: '' }, selectedSuspectId: String, submittedTheory: String, status: { type: String, enum: ['investigating','accused','completed'], default: 'investigating' }, attempts: { type: Number, default: 0 } }, { timestamps: true });
progressSchema.index({ caseId: 1, sessionId: 1 }, { unique: true });
export const CaseProgress = mongoose.model('CaseProgress', progressSchema);

const accusationSchema = new Schema({ caseId: { type: Schema.Types.ObjectId, required: true }, progressId: { type: Schema.Types.ObjectId, required: true }, selectedSuspectId: { type: String, required: true }, theory: { type: String, maxlength: 2000 }, citedEvidenceIds: { type: [String], default: [] }, isCorrect: { type: Boolean, required: true }, submittedAt: { type: Date, default: Date.now } });
export const Accusation = mongoose.model('Accusation', accusationSchema);
