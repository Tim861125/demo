import { APP_CONFIG } from "../../env-manager";
import type { ObsidianConfig } from "./obsidian.types";

export function getObsidianConfig(): ObsidianConfig {
	return {
		vaultPath: APP_CONFIG.OBSIDIAN.VAULT_PATH,
	};
}
