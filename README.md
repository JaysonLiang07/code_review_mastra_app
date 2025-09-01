# Code Review Mastra App

基于 Mastra AI 框架构建的智能代码审查自动化系统。该应用为软件开发团队提供自动化代码分析、质量评估和可执行的反馈建议。

## 🎯 项目概述

Code Review Mastra App 利用强大的 Mastra TypeScript AI 代理框架创建智能代理，能够分析代码仓库、识别问题并提供全面的审查反馈。系统结合静态分析、AI驱动的洞察和最佳实践建议，提升代码质量和开发工作流程。

## ✨ 功能特性

### 核心功能
- **自动代码分析**: 深度静态代码分析
- **AI驱动审查**: 使用大语言模型（GPT-4、Claude、Gemini）提供智能建议
- **多语言支持**: 支持 JavaScript、TypeScript、Python、Go 等多种语言
- **集成就绪**: 支持 GitHub、GitLab 和 Bitbucket 集成
- **自定义规则**: 可配置的审查规则和标准
- **报告生成**: 生成包含指标的综合审查报告

### 高级功能
- **安全扫描**: 漏洞检测和安全最佳实践
- **性能分析**: 代码效率和优化建议
- **文档检查**: 确保适当的代码文档
- **测试覆盖**: 分析测试完整性和质量
- **依赖分析**: 检查过时或有漏洞的依赖项

## 🛠️ 技术栈

- **框架**: [Mastra AI](https://mastra.ai) - TypeScript AI 代理框架
- **AI模型**: OpenAI GPT-4、Anthropic Claude、Google Gemini
- **编程语言**: TypeScript/JavaScript
- **数据库**: PostgreSQL/SQLite（存储审查历史）
- **队列系统**: Redis（处理后台任务）
- **API**: Express.js RESTful API

## 📋 环境要求

- Node.js (v18 或更高版本)
- npm 或 yarn
- Docker (可选)
- Git
- AI 服务 API 密钥 (OpenAI、Anthropic 或 Google)

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/[用户名]/code_review_mastra_app.git

# 进入项目目录
cd code_review_mastra_app

# 安装依赖
npm install

# 初始化 Mastra 项目（如果尚未完成）
npx create-mastra@latest . --existing

# 设置环境变量
cp .env.example .env

# 启动开发服务器
npm run dev
```

## ⚙️ 配置说明

### 环境变量

```env
# AI 服务配置
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/code_review

# GitHub 集成（可选）
GITHUB_PAT=your_github_personal_access_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# 应用设置
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Mastra 配置
MASTRA_DB_URL=postgresql://user:password@localhost:5432/mastra_db
```

### Mastra 代理配置

```typescript
// src/agents/codeReviewAgent.ts
import { Agent } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { codeAnalysisTool, securityScanTool } from '../tools';

export const codeReviewAgent = new Agent({
  name: '代码审查代理',
  instructions: `
    你是一位具有深厚软件工程最佳实践知识的专家代码审查员。
    
    你的职责：
    - 分析代码中的 bug、安全问题和性能问题
    - 检查是否遵循编码标准和最佳实践
    - 提出改进和优化建议
    - 提供清晰、可执行的反馈
    
    重点关注：
    - 代码质量和可维护性
    - 安全漏洞
    - 性能优化
    - 测试充分性
    - 文档完整性
  `,
  model: openai('gpt-4o'),
  tools: {
    codeAnalysisTool,
    securityScanTool,
    // 其他工具...
  },
});
```

## 🏗️ 项目结构

```
code_review_mastra_app/
├── src/
│   ├── agents/              # Mastra AI 代理
│   │   ├── codeReviewAgent.ts
│   │   └── securityAgent.ts
│   ├── tools/               # Mastra 工具
│   │   ├── codeAnalysis.ts
│   │   ├── githubIntegration.ts
│   │   └── reportGeneration.ts
│   ├── workflows/           # Mastra 工作流
│   │   ├── fullReview.ts
│   │   └── quickScan.ts
│   ├── integrations/        # 第三方集成
│   │   ├── github.ts
│   │   └── gitlab.ts
│   ├── api/                 # REST API 路由
│   │   ├── reviews.ts
│   │   └── webhooks.ts
│   ├── utils/               # 工具函数
│   └── types/               # TypeScript 类型定义
├── tests/                   # 测试文件
├── docs/                    # 文档
├── docker/                  # Docker 配置
└── mastra/                  # Mastra 配置
```

## 🎛️ 使用示例

### 基础代码审查

```typescript
import { mastra } from './mastra';

// 审查单个文件
const reviewFile = async (filePath: string) => {
  const agent = await mastra.getAgent('codeReviewAgent');
  
  const result = await agent.generate(
    `请审查这个代码文件: ${filePath}`,
    {
      tools: ['codeAnalysisTool', 'securityScanTool']
    }
  );
  
  return result.text;
};
```

### 仓库分析工作流

```typescript
// src/workflows/repositoryReview.ts
import { Workflow, Step } from '@mastra/core';

export const repositoryReviewWorkflow = new Workflow({
  name: '仓库审查',
  steps: [
    new Step({
      id: 'clone-repo',
      tool: 'gitCloneTool',
    }),
    new Step({
      id: 'analyze-structure',
      tool: 'projectAnalysisTool',
    }),
    new Step({
      id: 'security-scan',
      tool: 'securityScanTool',
    }),
    new Step({
      id: 'generate-report',
      tool: 'reportGenerationTool',
    }),
  ],
});
```

### GitHub 集成

```typescript
// GitHub Pull Request Webhook 处理器
app.post('/webhook/github', async (req, res) => {
  const { action, pull_request } = req.body;
  
  if (action === 'opened' || action === 'synchronize') {
    const workflow = await mastra.getWorkflow('pullRequestReview');
    
    await workflow.execute({
      repoUrl: pull_request.head.repo.clone_url,
      prNumber: pull_request.number,
      files: pull_request.changed_files,
    });
  }
  
  res.status(200).send('OK');
});
```

## 📊 API 接口

### 审查操作

```http
# 开始代码审查
POST /api/reviews
Content-Type: application/json

{
  "repository": "https://github.com/user/repo.git",
  "branch": "main",
  "type": "full" | "quick",
  "options": {
    "includeTests": true,
    "securityScan": true
  }
}

# 获取审查状态
GET /api/reviews/:reviewId

# 获取审查结果
GET /api/reviews/:reviewId/report

# 列出所有审查
GET /api/reviews?limit=10&offset=0
```

## 🔧 工具和集成

### 可用工具

1. **代码分析工具**: 静态代码分析和质量指标
2. **安全扫描器**: 漏洞检测和安全检查
3. **GitHub 集成**: 仓库访问和PR管理
4. **报告生成器**: 综合审查报告创建
5. **测试覆盖工具**: 测试分析和覆盖率指标

### 创建自定义工具

```typescript
// src/tools/customAnalysis.ts
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const customAnalysisTool = createTool({
  id: 'custom-analysis',
  description: '自定义代码分析工具',
  inputSchema: z.object({
    code: z.string().describe('要分析的源代码'),
    language: z.string().describe('编程语言'),
  }),
  outputSchema: z.object({
    issues: z.array(z.object({
      type: z.string(),
      severity: z.string(),
      message: z.string(),
      line: z.number().optional(),
    })),
    suggestions: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    // 自定义分析逻辑
    return analyzeCode(context.code, context.language);
  },
});
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行特定测试套件
npm test -- --grep "code-review"

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行集成测试
npm run test:integration
```

### 测试示例

```typescript
// tests/agents/codeReviewAgent.test.ts
import { mastra } from '../../src/mastra';

describe('代码审查代理', () => {
  it('应该识别安全漏洞', async () => {
    const agent = await mastra.getAgent('codeReviewAgent');
    
    const result = await agent.generate(
      '审查这段代码: const query = "SELECT * FROM users WHERE id = " + userId'
    );
    
    expect(result.text).toContain('SQL注入');
  });
});
```

## 🚀 部署

### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 生产环境设置

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 或使用 PM2 进行进程管理
pm2 start ecosystem.config.js
```

## 📈 监控和分析

### 跟踪指标

- 审查完成时间
- 每次审查检测到的问题数量
- 误报率
- 用户满意度分数
- API 响应时间

### 健康检查

```http
GET /health          # 基本健康检查
GET /health/detailed # 详细系统状态
GET /metrics        # Prometheus 指标
```

## 🤝 贡献指南

1. Fork 仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 安装依赖: `npm install`
4. 进行更改并添加测试
5. 运行测试套件: `npm test`
6. 提交更改: `git commit -m '添加惊人功能'`
7. 推送到分支: `git push origin feature/amazing-feature`
8. 提交 Pull Request

### 开发规范

- 遵循 TypeScript 最佳实践
- 为新功能添加测试
- 更新文档
- 使用规范的提交信息
- 确保 Mastra 代理和工具有适当的类型定义

## 📚 文档

- [Mastra 框架文档](https://mastra.ai/docs)
- [API 参考](./docs/api.md)
- [代理开发指南](./docs/agents.md)
- [自定义工具指南](./docs/tools.md)
- [部署指南](./docs/deployment.md)

## 🆘 故障排除

### 常见问题

**代理无响应**: 检查 API 密钥和网络连接
**内存使用过高**: 考虑对大型仓库实现流处理
**速率限制**: 实现适当的重试逻辑和速率限制

### 调试模式

```bash
# 启用调试日志
DEBUG=mastra:* npm run dev

# Mastra 调试代理的开发环境
npm run mastra dev
```

## 📄 许可证

此项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Mastra AI 团队](https://mastra.ai) 提供的优秀框架
- 开源社区的工具和灵感
- 贡献者和测试用户

---

使用 ⚡ Mastra AI 框架构建智能代码审查
