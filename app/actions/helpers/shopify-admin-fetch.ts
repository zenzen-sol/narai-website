import { SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT } from "lib/constants";
import { isShopifyError } from "lib/type-guards";
import { ensureStartsWith } from "lib/utils";

const domain = process.env.SHOPIFY_STORE_DOMAIN
	? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
	: "";
const endpoint = `${domain}/admin${SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT}`;
const key = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
	? T["variables"]
	: never;

export async function shopifyAdminFetch<T>({
	cache = "force-cache",
	headers,
	query,
	tags,
	variables,
}: {
	cache?: RequestCache;
	headers?: HeadersInit;
	query: string;
	tags?: string[];
	variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
	try {
		const result = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": key,
				...headers,
			},
			body: JSON.stringify({
				...(query && { query }),
				...(variables && { variables }),
			}),
			cache,
			...(tags && { next: { tags } }),
		});

		const body = await result.json();

		if (body.errors) {
			throw body.errors[0];
		}

		return {
			status: result.status,
			body,
		};
	} catch (e) {
		if (isShopifyError(e)) {
			throw {
				cause: e.cause?.toString() || "unknown",
				status: e.status || 500,
				message: e.message,
				query,
			};
		}

		throw {
			error: e,
			endpoint,
			query,
		};
	}
}
