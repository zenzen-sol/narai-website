"use server";

import { TAGS } from "lib/constants";
import {
	addToCart,
	createCart,
	getCart,
	removeFromCart,
	updateCart,
} from "lib/shopify";
import type { Cart } from "lib/shopify/types";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function addItem(selectedVariantId: string | undefined) {
	let cartId = (await cookies()).get("cartId")?.value;
	let cart: Cart | undefined = undefined;

	if (cartId) {
		cart = await getCart(cartId);
	}

	if (!cartId || !cart) {
		cart = await createCart();
		cartId = cart.id;
		(await cookies()).set("cartId", cartId);
	}

	if (!selectedVariantId) {
		return "Missing product variant ID";
	}

	try {
		await addToCart(cartId, [
			{ merchandiseId: selectedVariantId, quantity: 1 },
		]);
		revalidateTag(TAGS.cart);
	} catch (e) {
		return "Error adding item to cart";
	}
}

export const addItems = async ({
	variantId,
	quantity = 1,
}: {
	variantId: string | undefined;
	quantity: number;
}): Promise<string | undefined> => {
	let cartId = (await cookies()).get("cartId")?.value;
	let cart: Cart | undefined = undefined;

	if (cartId) {
		cart = await getCart(cartId);
	}

	if (!cartId || !cart) {
		cart = await createCart();
		cartId = cart.id;
		(await cookies()).set("cartId", cartId);
	}

	if (!variantId) {
		return "Missing product variant ID";
	}

	try {
		await addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
	} catch (e) {
		return quantity === 1
			? "Error adding item to cart"
			: "Error adding items to cart";
	}
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function removeItem(prevState: any, formData: FormData) {
	const lineId = formData.get("lineId") as string;
	const cartId = (await cookies()).get("cartId")?.value;

	if (!cartId) {
		return "Missing cart ID";
	}

	try {
		await removeFromCart(cartId, [lineId]);
		revalidateTag(TAGS.cart);
	} catch (e) {
		return "Error removing item from cart";
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function updateItemQuantity(prevState: any, formData: FormData) {
	const lineId = formData.get("lineId") as string;
	const variantId = formData.get("variantId") as string;
	const quantity = Number.parseInt(formData.get("quantity") as string, 10);

	const cartId = (await cookies()).get("cartId")?.value;

	if (!cartId) {
		return "Missing cart ID";
	}

	try {
		if (quantity === 0) {
			await removeFromCart(cartId, [lineId]);
			revalidateTag(TAGS.cart);
			return;
		}

		await updateCart(cartId, [
			{
				id: lineId,
				merchandiseId: variantId,
				quantity,
			},
		]);
		revalidateTag(TAGS.cart);
	} catch (e) {
		return "Error updating item quantity";
	}
}
