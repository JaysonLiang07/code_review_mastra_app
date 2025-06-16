
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";

export const mastra = new Mastra({
  deployer: new CloudflareDeployer({
		scope: process.env.CLOUDFLARE_ACCOUNT_ID || 'your-cloudflare-scope',
		projectName: 'code-review-mastra-worker',
		workerNamespace: 'production',
		auth: {
			apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
			apiEmail: 'liangzhishun000@gmail.com',
		},
	}),
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
