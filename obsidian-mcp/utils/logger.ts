export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

export function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
	const timestamp = new Date().toISOString();
	const metaStr = meta ? ` | ${JSON.stringify(meta)}` : "";
	const levelColors: Record<LogLevel, string> = {
		INFO: "\x1b[36m",   // Cyan
		WARN: "\x1b[33m",   // Yellow
		ERROR: "\x1b[31m",  // Red
		DEBUG: "\x1b[90m",  // Gray
	};
	const reset = "\x1b[0m";
	// 使用 stderr 避免干擾 stdio MCP 協議通道
	console.error(`${levelColors[level]}[${timestamp}] [${level}]${reset} ${message}${metaStr}`);
}
