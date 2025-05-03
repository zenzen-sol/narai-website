import Footer from "components/layout/footer";

import Navbar from "components/layout/navbar";
import { getShopifyLocale } from "lib/locales";
import { getCart, getPage, getProduct } from "lib/shopify";
import type { Cart, Product } from "lib/shopify/types";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { Suspense } from "react";
import AboutNaraiDetail from "./about-narai-detail";

const { SITE_NAME } = process.env;

export const metadata = {
	title: SITE_NAME,
	description: SITE_NAME,
	openGraph: {
		type: "website",
	},
};

export default async function Page() {
	const locale = await getLocale();

	const cartId = (await cookies()).get("cartId")?.value;
	let cart: Cart | undefined;

	if (cartId) {
		cart = await getCart(cartId);
	}

	const promotedItem: Product | undefined = await getProduct({
		handle: "gift-bag-and-postcard-set",
		language: getShopifyLocale({ locale: locale }),
	});

	const awardsPage = await getPage({
		handle: "awards",
		language: getShopifyLocale({ locale: locale }),
	});

	return (
		<div>
			<Navbar cart={cart} locale={locale} compact promotedItem={promotedItem} />
			<Suspense fallback={null}>
				<div className="pt-24 md:pt-32">
					<AboutNaraiDetail awards={awardsPage.body} />
				</div>
			</Suspense>

			<Footer cart={cart} />
		</div>
	);
}
