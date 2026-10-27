import 'dotenv/config';
import { setServers } from 'node:dns';
import { z } from 'zod';

const dnsServersSchema = z.string().optional()
  .transform(value => value?.split(',').map(server => server.trim()))
  .pipe(z.array(z.string().ip()).optional());
const schema = z.object({ NODE_ENV: z.enum(['development','production','test']).default('development'), PORT: z.coerce.number().int().positive().default(5000), MONGODB_URI: z.string().min(1), DNS_SERVERS: dnsServersSchema, GEMINI_API_KEY: z.string().optional(), GEMINI_TEXT_MODEL: z.string().optional(), CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'), SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must contain at least 32 characters') });
const parsed = schema.safeParse(process.env);
if (!parsed.success) { console.error('Invalid server configuration:', parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')); process.exit(1); }
export const config = parsed.data;
if (config.DNS_SERVERS) setServers(config.DNS_SERVERS);
