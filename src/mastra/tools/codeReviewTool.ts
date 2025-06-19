import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const codeReviewTool = createTool({
  id: 'code-review',
  description: 'Analyzes code for issues, bugs, and improvement opportunities',
  inputSchema: z.object({
    code: z.string().describe("The source code to analyze"),
    language: z.string().describe("Programming language of the code (e.g., javascript, typescript, python)"),
    focusAreas: z.array(z.string()).optional().describe("Specific areas to focus on (e.g., security, performance, maintainability)")
  }),
  outputSchema: z.object({
    issues: z.array(z.object({
      severity: z.enum(["critical", "high", "medium", "low", "info"]),
      line: z.number().optional(),
      description: z.string(),
      suggestion: z.string().optional()
    })),
    summary: z.string(),
    positiveAspects: z.array(z.string()),
    suggestedImprovements: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const { code, language, focusAreas = [] } = context;
    
    // Analyze the code
    const issues = analyzeCode(code, language, focusAreas);
    
    // Generate positive aspects
    const positiveAspects = findPositiveAspects(code, language);
    
    // Generate suggested improvements
    const suggestedImprovements = generateImprovements(issues, language);
    
    // Create summary
    const summary = generateSummary(issues, language);
    
    return {
      issues,
      summary,
      positiveAspects,
      suggestedImprovements,
    };
  },
});

// Helper function to analyze code
function analyzeCode(code: string, language: string, focusAreas: string[]) {
  const issues = [];
  const lines = code.split('\n');
  
  // Define patterns to check for different languages
  const patterns: Record<string, Array<{
    pattern: RegExp;
    severity: "critical" | "high" | "medium" | "low" | "info";
    description: string;
    suggestion?: string;
  }>> = {
    javascript: [
      {
        pattern: /eval\(/g,
        severity: "critical",
        description: "Use of eval() function",
        suggestion: "Avoid using eval() as it poses security risks. Consider using safer alternatives."
      },
      {
        pattern: /==(?!=)/g,
        severity: "medium",
        description: "Using loose equality (==) instead of strict equality (===)",
        suggestion: "Use === for strict type comparison to avoid unexpected type coercion"
      },
      {
        pattern: /\.innerHTML\s*=/g,
        severity: "high",
        description: "Direct manipulation of innerHTML",
        suggestion: "Consider using safer alternatives like textContent or DOM methods to prevent XSS"
      }
    ],
    typescript: [
      {
        pattern: /: any/g,
        severity: "medium",
        description: "Use of 'any' type",
        suggestion: "Use more specific types to improve type safety"
      },
      {
        pattern: /!=(?!=)/g,
        severity: "medium",
        description: "Using loose inequality (!=) instead of strict inequality (!==)",
        suggestion: "Use !== for strict type comparison"
      }
    ],
    python: [
      {
        pattern: /except:/g,
        severity: "medium",
        description: "Bare except clause",
        suggestion: "Specify exception types to catch instead of using bare except"
      },
      {
        pattern: /exec\(/g,
        severity: "critical",
        description: "Use of exec() function",
        suggestion: "Avoid using exec() as it poses security risks"
      }
    ],
    // Add more languages as needed
  };
  
  // Common patterns across languages
  const commonPatterns = [
    {
      pattern: /TODO|FIXME/gi,
      severity: "low" as const,
      description: "Found TODO/FIXME comment",
      suggestion: "Consider addressing this TODO or creating a specific issue to track it"
    },
    {
      pattern: /console\.log|print|System\.out\.println/gi,
      severity: "low" as const,
      description: "Debug statement found",
      suggestion: "Remove debug statements before production deployment"
    },
    {
      pattern: /password|secret|apikey|token/gi,
      severity: "high" as const,
      description: "Possible hardcoded credential",
      suggestion: "Store sensitive values in environment variables or secure storage"
    }
  ];
  
  // Check language-specific patterns
  const languagePatterns = patterns[language.toLowerCase()] || [];
  for (const { pattern, severity, description, suggestion } of languagePatterns) {
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        issues.push({
          severity,
          line: i + 1,
          description,
          suggestion
        });
      }
    }
  }
  
  // Check common patterns
  for (const { pattern, severity, description, suggestion } of commonPatterns) {
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        issues.push({
          severity,
          line: i + 1,
          description,
          suggestion
        });
      }
    }
  }
  
  return issues;
}

// Find positive aspects of the code
function findPositiveAspects(code: string, language: string): string[] {
  const positiveAspects = [];
  
  // Check if no critical issues were found
  if (!code.includes('eval(') && !code.includes('innerHTML =')) {
    positiveAspects.push("No obvious critical security vulnerabilities detected");
  }
  
  // Check for good practices
  if (language === 'javascript' || language === 'typescript') {
    if (code.includes('===') && !code.includes('==')) {
      positiveAspects.push("Uses strict equality operators consistently");
    }
    
    if (code.includes('const ') && !code.includes('var ')) {
      positiveAspects.push("Uses modern variable declarations (const/let) instead of var");
    }
    
    if (code.includes('try') && code.includes('catch')) {
      positiveAspects.push("Implements error handling with try/catch blocks");
    }
  }
  
  if (language === 'python') {
    if (code.includes('if __name__ == "__main__"')) {
      positiveAspects.push("Uses proper module structure with __name__ == '__main__' check");
    }
    
    if (code.includes('def ') && code.includes(':')) {
      positiveAspects.push("Uses proper function definitions with consistent indentation");
    }
  }
  
  // If no positive aspects were found, add a generic one
  if (positiveAspects.length === 0) {
    positiveAspects.push("The code is structured in a readable manner");
  }
  
  return positiveAspects;
}

// Generate improvement suggestions
function generateImprovements(issues: any[], language: string): string[] {
  const improvements = [];
  
  // Group issues by severity
  const criticalIssues = issues.filter(issue => issue.severity === 'critical');
  const highIssues = issues.filter(issue => issue.severity === 'high');
  const mediumIssues = issues.filter(issue => issue.severity === 'medium');
  
  // Suggest fixing critical issues first
  if (criticalIssues.length > 0) {
    improvements.push("Address all critical security vulnerabilities as a top priority");
  }
  
  // Suggest fixing high severity issues
  if (highIssues.length > 0) {
    improvements.push("Fix high-severity issues to improve code security and stability");
  }
  
  // Language-specific improvements
  if (language === 'javascript' || language === 'typescript') {
    if (issues.some(issue => issue.description.includes('loose equality'))) {
      improvements.push("Replace all instances of == with === for more predictable comparisons");
    }
    
    if (issues.some(issue => issue.description.includes('innerHTML'))) {
      improvements.push("Replace innerHTML assignments with safer DOM manipulation methods");
    }
  }
  
  if (language === 'python') {
    if (issues.some(issue => issue.description.includes('bare except'))) {
      improvements.push("Specify exception types in all except clauses for better error handling");
    }
  }
  
  // General improvements
  if (issues.some(issue => issue.description.includes('TODO'))) {
    improvements.push("Address or create tickets for all TODO comments in the code");
  }
  
  if (issues.some(issue => issue.description.includes('debug statement'))) {
    improvements.push("Remove all debug statements (console.log, print) before production deployment");
  }
  
  // If no specific improvements were identified, add a generic one
  if (improvements.length === 0) {
    improvements.push("Consider adding comprehensive error handling");
    improvements.push("Add comments to explain complex logic or business rules");
  }
  
  return improvements;
}

// Generate a summary of the code review
function generateSummary(issues: any[], language: string): string {
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const highCount = issues.filter(i => i.severity === 'high').length;
  const mediumCount = issues.filter(i => i.severity === 'medium').length;
  const lowCount = issues.filter(i => i.severity === 'low').length;
  
  let summary = `Code review for ${language} code: `;
  
  if (criticalCount > 0) {
    summary += `Found ${criticalCount} critical, `;
  }
  
  summary += `${highCount} high, ${mediumCount} medium, and ${lowCount} low severity issues. `;
  
  if (criticalCount > 0 || highCount > 0) {
    summary += "Immediate attention recommended.";
  } else if (mediumCount > 0) {
    summary += "Some improvements needed.";
  } else {
    summary += "Code quality is good with only minor issues.";
  }
  
  return summary;
}