import Footer from "components/layout/footer";

import Navbar from "components/layout/navbar";
import { getCart } from "lib/shopify";
import type { Cart } from "lib/shopify/types";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

const { SITE_NAME } = process.env;

export const metadata = {
	title: SITE_NAME,
	description: SITE_NAME,
	openGraph: {
		type: "website",
	},
};

export default async function ProductLayout(props: {
	children: ReactNode[] | ReactNode | string;
}) {
	const locale = await getLocale();

	const { children } = props;

	const cartId = (await cookies()).get("cartId")?.value;
	let cart: Cart | undefined;

	if (cartId) {
		cart = await getCart(cartId);
	}

	return (
		<div>
			<Navbar cart={cart} locale={locale} compact />
			{children}
			<Footer cart={cart} />
		</div>
	);
}
