import { glob } from "glob";
import path from "path";
import { getObsidianConfig } from "./obsidian.config";
import type { NoteSearchResult, RecentNote } from "./obsidian.types";

export class ObsidianService {
	private readonly vaultPath: string;

	constructor() {
		const config = getObsidianConfig();
		this.vaultPath = config.vaultPath;
	}

	resolveSafePath(relativePath: string): string {
		const vaultRoot = path.resolve(this.vaultPath);
		const absolutePath = path.resolve(vaultRoot, relativePath);
		if (absolutePath !== vaultRoot && !absolutePath.startsWith(vaultRoot + path.sep)) {
			throw new Error("存取路徑超出 Vault 範圍。");
		}
		return absolutePath;
	}

	async searchNotes(query: string): Promise<NoteSearchResult[]> {
		const files = await glob("**/*.md", { cwd: this.vaultPath, absolute: true });
		const lowerQuery = query.toLowerCase();

		const results = (
			await Promise.all(
				files.map(async (file) => {
					const content = await Bun.file(file).text();
					if (
						!path.basename(file).toLowerCase().includes(lowerQuery) &&
						!content.toLowerCase().includes(lowerQuery)
					) {
						return null;
					}
					return {
						path: path.relative(this.vaultPath, file),
						preview: content.length > 200 ? content.slice(0, 200) + "..." : content,
					};
				})
			)
		).filter((r): r is NoteSearchResult => r !== null);

		return results;
	}

	async readNote(relativePath: string): Promise<string> {
		const fullPath = this.resolveSafePath(relativePath);
		const file = Bun.file(fullPath);
		if (!(await file.exists())) {
			throw new Error(`找不到檔案 ${relativePath}`);
		}
		return file.text();
	}

	async listRecentNotes(count: number): Promise<RecentNote[]> {
		const files = await glob("**/*.md", { cwd: this.vaultPath, absolute: true });

		return files
			.map((file) => ({ file, mtime: Bun.file(file).lastModified }))
			.sort((a, b) => b.mtime - a.mtime)
			.slice(0, count)
			.map(f => ({
				path: path.relative(this.vaultPath, f.file),
				modified: new Date(f.mtime).toISOString(),
			}));
	}
}

let _service: ObsidianService | undefined;

export function getObsidianService(): ObsidianService {
	if (!_service) {
		_service = new ObsidianService();
	}
	return _service;
}
