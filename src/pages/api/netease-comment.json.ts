import { backgroundWallpaper } from "@/config";

export const prerender = true;

const apiUrl = "https://v1.apizero.cn/api/netease-comment";

type NeteaseCommentResponse = {
	code?: number;
	data?: {
		comment?: {
			content?: unknown;
		};
	};
};

function getFallbackSubtitle(): string {
	const subtitle = backgroundWallpaper.common?.homeText?.subtitle;
	const fallback = Array.isArray(subtitle) ? subtitle[0] : subtitle;
	return fallback?.trim() || "愿你今天也能听见心里的声音。";
}

function truncateComment(
	content: unknown,
	maxLength: number,
): string | undefined {
	if (typeof content !== "string") return;

	const normalized = content.trim().replace(/\s+/g, " ");
	if (!normalized) return;

	const characters = Array.from(normalized);
	return characters.length > maxLength
		? `${characters.slice(0, maxLength).join("")}…`
		: normalized;
}

function createResponse(content: string, isFallback: boolean) {
	return new Response(JSON.stringify({ content, isFallback }), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			// API 结果是构建期静态文件；浏览器端由 localStorage 控制 24 小时缓存。
			"Cache-Control": "no-store",
		},
	});
}

export async function GET() {
	const commentConfig = backgroundWallpaper.common?.homeText?.neteaseComment;
	const fallback = getFallbackSubtitle();

	// 未启用、开发服务器或缺少密钥时不访问第三方接口，避免意外消耗额度。
	if (!commentConfig?.enable || import.meta.env.DEV) {
		return createResponse(fallback, true);
	}

	const apiKey = import.meta.env.APIZERO_API_KEY?.trim();
	if (!apiKey) return createResponse(fallback, true);

	const maxLength = Math.max(1, Math.floor(commentConfig.maxLength ?? 88));
	const requestUrl = new URL(apiUrl);
	requestUrl.searchParams.set("key", apiKey);

	try {
		const response = await fetch(requestUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}",
			signal: AbortSignal.timeout(8000),
		});
		if (!response.ok) return createResponse(fallback, true);

		const payload = (await response.json()) as NeteaseCommentResponse;
		const content = truncateComment(payload.data?.comment?.content, maxLength);
		return createResponse(content || fallback, !content);
	} catch {
		return createResponse(fallback, true);
	}
}
