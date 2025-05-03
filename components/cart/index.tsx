import { getShopifyLocale } from "lib/locales";
import { getCart, getProduct } from "lib/shopify";
import type { Cart, Product } from "lib/shopify/types";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import CartTrigger from "./cart-trigger";

export default async function MainCart() {
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

	return <CartTrigger cart={cart} promotedItem={promotedItem} />;
}
