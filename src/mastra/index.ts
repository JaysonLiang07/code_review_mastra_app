import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { codeReviewAgent } from './agents/code-review';
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";

export const mastra = new Mastra({
  deployer: new CloudflareDeployer({
    scope: process.env.CLOUDFLARE_ACCOUNT_ID || 'your-cloudflare-scope',
    projectName: 'code-review-mastra-worker',
    workerNamespace: 'production',
    auth: {
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
      apiEmail: process.env.CLOUDFLARE_EMAIL || 'your-email@example.com',
    },
  }),
  workflows: { weatherWorkflow },
  agents: { weatherAgent, codeReviewAgent },
  storage: new LibSQLStore({
    url: ':memory:',
  }),
});

// Cloudflare Worker 导出
export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    return mastra.handleRequest(request);
  }
};