import Footer from "components/layout/footer";

import Navbar from "components/layout/navbar";
import { getShopifyLocale } from "lib/locales";
import { getCart, getProduct } from "lib/shopify";
import type { Cart, Product } from "lib/shopify/types";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { Suspense } from "react";
import PrivacyPolicy from "./privacy-policy";

const { SITE_NAME } = process.env;

export const metadata = {
	title: SITE_NAME,
	description: SITE_NAME,
	openGraph: {
		type: "website",
	},
};

export default async function PrivacyPage() {
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
			<Navbar cart={cart} locale={locale} compact promotedItem={promotedItem} />
			<Suspense fallback={null}>
				<div className="py-24 md:py-48">
					<PrivacyPolicy />
				</div>
			</Suspense>

			<Footer cart={cart} />
		</div>
	);
}
