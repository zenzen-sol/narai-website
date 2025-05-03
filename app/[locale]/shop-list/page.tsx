import type { Metadata } from "next";

import Footer from "components/layout/footer";
import Navbar from "components/layout/navbar";
import { getShopifyLocale } from "lib/locales";
import { getCart, getPage, getProduct } from "lib/shopify";
import type { Cart, Product } from "lib/shopify/types";
import { getLocale } from "next-intl/server";
import { unstable_noStore } from "next/cache";
import { cookies } from "next/headers";
import { Suspense } from "react";
import ShopListDetail from "./shop-list-detail";
import ShopsNav from "./shops-nav";

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	unstable_noStore(); // opt out from partial prerendering
	const page = await getPage({
		handle: "shop-list",
		language: getShopifyLocale({ locale }),
	});

	if (!page) return {};

	return {
		title: page.seo?.title || page.title,
		description: page.seo?.description || page.bodySummary,
		openGraph: {
			publishedTime: page.createdAt,
			modifiedTime: page.updatedAt,
			type: "article",
		},
	};
}

export default async function Page() {
	const locale = await getLocale();

	const cartId = (await cookies()).get("cartId")?.value;
	let cart: Cart | undefined;

	if (cartId) {
		cart = await getCart(cartId);
	}

	const promotedItem: Product | undefined = await getProduct({
		handle: "gift-bag-and-postcard-set",
		language: getShopifyLocale({ locale }),
	});

	return (
		<div>
			<Navbar
				cart={cart}
				locale={locale}
				compact
				showTop
				promotedItem={promotedItem}
			/>
			<div className="mx-auto max-w-xl px-6 pb-24 pt-12 md:pb-48 md:pt-24">
				<div className="pb-12">
					<ShopsNav />
				</div>
				<Suspense fallback={null}>
					<ShopListDetail language={getShopifyLocale({ locale })} />
				</Suspense>
			</div>

			<Footer cart={cart} />
		</div>
	);
}
