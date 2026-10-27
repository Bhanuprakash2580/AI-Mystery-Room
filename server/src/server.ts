import mongoose from 'mongoose';
import { config } from './config.js';
import app from './app.js';
import { MysteryCase } from './models.js';
import { generateCase } from './generation.js';

await mongoose.connect(config.MONGODB_URI);
const server=app.listen(config.PORT,()=>console.log(`AI Mystery Room API listening on port ${config.PORT}`));
const interrupted=await MysteryCase.find({status:{$in:['queued','generating','validating']}}).lean();
for(const c of interrupted){void generateCase(c._id.toString(),{premise:c.premise,setting:c.setting,category:c.category,difficulty:c.difficulty,suspectCount:c.suspectCount||4,evidenceTypes:c.evidenceTypes} as any)}
async function shutdown(){server.close();await mongoose.disconnect();process.exit(0)}
process.on('SIGTERM',()=>void shutdown());process.on('SIGINT',()=>void shutdown());
