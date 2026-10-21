import { execFileSync } from "node:child_process";

let cachedCommitDate: string | null | undefined;

/** 构建时读取一次；无 Git 的构建环境可通过 LAST_COMMIT_DATE 提供 ISO 时间。 */
export function getLastCommitDate(): string | null {
	if (cachedCommitDate !== undefined) return cachedCommitDate;

	let value: string | undefined;
	try {
		value = execFileSync("git", ["log", "-1", "--format=%cI"], {
			cwd: process.cwd(),
			encoding: "utf8",
			timeout: 2000,
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
	} catch {
		value = process.env.LAST_COMMIT_DATE?.trim();
	}

	const date = value ? new Date(value) : null;
	cachedCommitDate =
		date && Number.isFinite(date.getTime()) ? date.toISOString() : null;
	return cachedCommitDate;
}
