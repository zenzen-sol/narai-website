import OpengraphImage from "components/opengraph-image";
import { getShopifyLocale } from "lib/locales";
import { getPage } from "lib/shopify";
import { getLocale } from "next-intl/server";

export default async function Image({
	params,
}: {
	params: { page: string };
}) {
	const locale = await getLocale();

	const page = await getPage({
		handle: params.page,
		language: getShopifyLocale({ locale }),
	});
	const title = page.seo?.title || page.title;

	return await OpengraphImage({ title });
}
