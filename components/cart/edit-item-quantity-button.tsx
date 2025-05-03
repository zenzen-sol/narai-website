"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { updateItemQuantity } from "components/cart/actions";
import LoadingDots from "components/loading-dots";
import type { CartItem } from "lib/shopify/types";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			onClick={(e: React.FormEvent<HTMLButtonElement>) => {
				if (pending) e.preventDefault();
			}}
			aria-label={
				type === "plus" ? "Increase item quantity" : "Reduce item quantity"
			}
			aria-disabled={pending}
			className={clsx(
				"ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
				{
					"cursor-not-allowed": pending,
					"ml-auto": type === "minus",
				},
			)}
		>
			{pending ? (
				<LoadingDots className="bg-white" />
			) : type === "plus" ? (
				<PlusIcon className="h-4 w-4 dark:text-neutral-500" />
			) : (
				<MinusIcon className="h-4 w-4 dark:text-neutral-500" />
			)}
		</button>
	);
}

export function EditItemQuantityButton({
	item,
	type,
}: { item: CartItem; type: "plus" | "minus" }) {
	const [message, formAction] = useActionState(updateItemQuantity, null);
	const payload = {
		lineId: item.id,
		variantId: item.merchandise.id,
		quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
	};

	return (
		<form action={formAction}>
			<input type="hidden" name="lineId" value={payload.lineId} />
			<input type="hidden" name="variantId" value={payload.variantId} />
			<input
				type="hidden"
				name="quantity"
				value={payload.quantity.toString()}
			/>
			<SubmitButton type={type} />
			<p aria-live="polite" className="sr-only">
				{typeof message === "string" ? message : ""}
			</p>
		</form>
	);
}
