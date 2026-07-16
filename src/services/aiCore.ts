export interface GenerationOptions {
  provider?: "gemini" | "openai" | "claude" | "local";
  role?: string;
  temperature?: number;
}

export interface LLMResponse {
  text: string;
  codeBlock?: { lang: string; code: string };
  tableData?: Array<Record<string, string>>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    estimatedCost: number;
    responseTimeMs: number;
  };
}

// 1. Centralised System Prompts Registry
export const SYSTEM_PROMPTS = {
  Base: "You are the SHIVIL AI Operating System for Universities. Solve academic and administrative queries.",
  StudentWorkspace: "Context: Viewing Student Profile. Focus on CGPA trajectory, backlogs, skills, and placement eligibility.",
  FacultyWorkspace: "Context: Viewing Faculty Profile. Focus on teaching load distributions, research grant approvals, and feedback score averages.",
  AttendanceCenter: "Context: Viewing Attendance registers. Focus on shortage rosters, daily check-in heatmaps, and parent alert SMS warnings.",
  DashboardCommand: "Context: Viewing University Command Center. Focus on executive indices, budgets, and drop-out risk forecasts.",
  WorkflowStudio: "Context: Visual Automation Editor. Focus on visual node links, triggers, cron conditions, and email/SMS warning templates."
};

// 2. Global AI Usage Registry
export interface AIUsageRecord {
  timestamp: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  costUSD: number;
  latencyMs: number;
}

const usageLogs: AIUsageRecord[] = [];

export const getAIUsageLogs = (): AIUsageRecord[] => [...usageLogs];

// 3. Provider abstraction wrapper
export const aiCoreService = {
  generateResponse: async (
    prompt: string, 
    context: string = "Base", 
    options: GenerationOptions = {}
  ): Promise<LLMResponse> => {
    const startTime = Date.now();
    const provider = options.provider || "gemini";
    const selectedSystemPrompt = SYSTEM_PROMPTS[context as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.Base;

    // Safety constraint PII filter
    const sanitizedPrompt = prompt
      .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "[REDACTED_CREDIT_CARD]")
      .trim();

    // Emulate server generation latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    let text = "";
    let codeBlock: { lang: string; code: string } | undefined;
    let tableData: Array<Record<string, string>> | undefined;

    const query = sanitizedPrompt.toLowerCase();

    // Provider variations signatures
    const providerPrefix = provider === "gemini" 
      ? "[Google Gemini Pro] " 
      : provider === "openai" 
      ? "[OpenAI GPT-4o] " 
      : "[Claude 3.5 Sonnet] ";

    // NLP intent routing logic
    if (query.includes("attendance") || query.includes("shortage")) {
      text = `${providerPrefix}Attendance analysis compiled. System checked compliance limits:`;
      tableData = [
        { Student: "Neha Reddy", Roll: "APEX-2026-002", Attendance: "58%", Status: "Critical shortage" },
        { Student: "Anya Sen", Roll: "APEX-2026-044", Attendance: "64%", Status: "Alert" }
      ];
    } else if (query.includes("timetable") || query.includes("schedule")) {
      text = `${providerPrefix}Generated slot timetable configuration matching classroom capacities:`;
      codeBlock = {
        lang: "json",
        code: JSON.stringify({
          semester: "V-B",
          slots: [
            { time: "09:30 AM", subject: "Discrete Math", room: "Room 102" },
            { time: "01:30 PM", subject: "ML Lab", room: "Lab 4" }
          ]
        }, null, 2)
      };
    } else if (query.includes("dropout") || query.includes("risk")) {
      text = `${providerPrefix}AI Risk forecast: Overall risk boundary indexes calculated at 2.4% overall probability. Detail warning queued for Neha Reddy due to attendance drop.`;
    } else {
      text = `${providerPrefix}Query processed under context '${selectedSystemPrompt}': Received request: "${sanitizedPrompt}". How would you like me to process this metrics database?`;
    }

    const latency = Date.now() - startTime;
    const promptTokens = Math.ceil(sanitizedPrompt.length / 4) + 50;
    const completionTokens = Math.ceil(text.length / 4) + 80;
    
    // Cost mapping constants
    const costPerToken = provider === "openai" ? 0.000015 : provider === "claude" ? 0.00002 : 0.000005;
    const estimatedCost = (promptTokens + completionTokens) * costPerToken;

    // Track usage
    usageLogs.push({
      timestamp: new Date().toISOString(),
      provider,
      promptTokens,
      completionTokens,
      costUSD: estimatedCost,
      latencyMs: latency
    });

    return {
      text,
      codeBlock,
      tableData,
      usage: {
        promptTokens,
        completionTokens,
        estimatedCost,
        responseTimeMs: latency
      }
    };
  }
};
