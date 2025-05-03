"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { removeItem } from "components/cart/actions";
import LoadingDots from "components/loading-dots";
import type { CartItem } from "lib/shopify/types";
import { useActionState } from "react";

function SubmitButton({ pending }: { pending: boolean }) {
	return (
		<button
			type="submit"
			aria-label="Remove cart item"
			aria-disabled={pending}
			className={clsx(
				"ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-dark transition-all duration-200",
				{
					"cursor-not-allowed px-0": pending,
				},
			)}
		>
			{pending ? (
				<LoadingDots className="bg-white" />
			) : (
				<XMarkIcon className="mx-[1px] h-4 w-4 text-white transition-opacity duration-150 hover:opacity-60 dark:text-black" />
			)}
		</button>
	);
}

export function DeleteItemButton({ item }: { item: CartItem }) {
	const [deleteState, formAction, pending] = useActionState(removeItem, null);
	const itemId = item.id;

	return (
		<form action={formAction}>
			<input type="hidden" name="lineId" value={itemId} />
			<SubmitButton pending={pending} />
			<p aria-live="polite" className="sr-only">
				{typeof deleteState === "string" ? deleteState : ""}
			</p>
		</form>
	);
}
