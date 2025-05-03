"use client";

import type { Cart, Product } from "lib/shopify/types";
import { useEffect } from "react";
import { useCart } from "./cart-provider";
import OpenCart from "./open-cart";

export default function CartTrigger({
	cart,
	promotedItem,
}: {
	cart: Cart | undefined;
	promotedItem?: Product;
}) {
	const { openCart, setPromotedItem } = useCart();

	useEffect(() => {
		console.debug("[CartTrigger] useEffect | promotedItem", promotedItem);
		if (promotedItem) {
			setPromotedItem(promotedItem);
		}
	}, [promotedItem, setPromotedItem]);

	return (
		<>
			<div key="cart-container">
				<button
					type="button"
					aria-label="Open cart"
					onClick={openCart}
					className="focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
				>
					<OpenCart quantity={cart?.totalQuantity} />
				</button>
			</div>
		</>
	);
}
