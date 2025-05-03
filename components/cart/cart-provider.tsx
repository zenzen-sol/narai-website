"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useAgeConfirmation } from "app/hooks/use-age-confirmation";
import Price from "components/price";
import AgeGateForm from "components/product/age-gate-form";
import { DEFAULT_OPTION } from "lib/constants";
import type { Cart, Product } from "lib/shopify/types";
import { createUrl } from "lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
	Fragment,
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import CloseCart from "./close-cart";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import { PromotedCartItem } from "./promoted-cart-item";

type MerchandiseSearchParams = {
	[key: string]: string;
};

type CartProviderInboundProps = {
	initialPromotedItem?: Product;
	children?: ReactNode | ReactNode[] | string;
};

type CartProviderOutboundProps = {
	// eslint-disable-next-line no-unused-vars
	setCart: (_cart?: Cart) => void;
	openCart: () => void;
	closeCart: () => void;
	// eslint-disable-next-line no-unused-vars
	setPromotedItem: (_item?: Product) => void;
};

const CartProviderContext = createContext<CartProviderOutboundProps>({
	setCart: () => {},
	openCart: () => {},
	closeCart: () => {},
	setPromotedItem: () => {},
});

export function CartProvider({
	initialPromotedItem,
	children,
}: CartProviderInboundProps) {
	const t = useTranslations("Index");

	const [cart, setCart] = useState<Cart | undefined>(undefined);

	const [isOpen, setIsOpen] = useState(false);
	const [promotedItem, setPromotedItem] = useState<Product | undefined>(
		initialPromotedItem,
	);

	const [isConfirming, setIsConfirming] = useState<boolean>(false);
	const { ageConfirmed } = useAgeConfirmation();

	const quantityRef = useRef(cart?.totalQuantity);
	const openCart = useCallback(() => setIsOpen(true), []);
	const closeCart = useCallback(() => setIsOpen(false), []);

	useEffect(() => {
		// Open cart modal when quantity changes.
		if (!cart) {
			return;
		}

		// Initialize quantityRef if needed
		if (quantityRef.current === undefined) {
			quantityRef.current = cart.totalQuantity;
			// Open cart on first item added
			if (cart.totalQuantity > 0 && !isOpen) {
				setIsOpen(true);
			}
			return;
		}

		if (cart.totalQuantity > 0 && cart.totalQuantity !== quantityRef.current) {
			// But only if it's not already open (quantity also changes when editing items in cart).
			if (!isOpen) {
				setIsOpen(true);
			}
		}
		// Always update the quantity reference
		quantityRef.current = cart.totalQuantity;
	}, [cart, isOpen]);

	useEffect(() => {
		console.debug("[CartProvider] useEffect | promotedItem", promotedItem);
	}, [promotedItem]);

	useEffect(() => {
		return () => {
			setIsConfirming(false);
		};
	}, []);

	const checkoutWithAgeCheck = () => {
		setIsOpen(true);
		setIsConfirming(true);
	};

	// Memoize the context value
	const contextValue = useMemo(
		() => ({
			openCart,
			closeCart,
			setCart,
			setPromotedItem,
		}),
		[openCart, closeCart],
	);

	return (
		<CartProviderContext.Provider value={contextValue}>
			<Transition show={isOpen} key={cart?.id || "empty-cart"}>
				<Dialog
					onClose={closeCart}
					className="relative z-50 w-0"
					key="main-cart"
				>
					<Transition.Child
						as={Fragment}
						enter="transition-all ease-in-out duration-300"
						enterFrom="opacity-0 backdrop-blur-none"
						enterTo="opacity-100 backdrop-blur-[.5px]"
						leave="transition-all ease-in-out duration-200"
						leaveFrom="opacity-100 backdrop-blur-[.5px]"
						leaveTo="opacity-0 backdrop-blur-none"
					>
						<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
					</Transition.Child>
					<Transition.Child
						as={Fragment}
						enter="transition-all ease-in-out duration-300"
						enterFrom="translate-x-full"
						enterTo="translate-x-0"
						leave="transition-all ease-in-out duration-200"
						leaveFrom="translate-x-0"
						leaveTo="translate-x-full"
					>
						<Dialog.Panel className="fixed inset-y-0 right-0 flex h-full w-full flex-col border-l border-white/20 bg-dark p-6 font-sans text-white backdrop-blur-xl md:w-[390px]">
							<div className="flex items-center justify-between">
								<p className="text-lg font-semibold">Shopping bag</p>

								<button
									type="button"
									aria-label="Close cart"
									onClick={closeCart}
								>
									<CloseCart />
								</button>
							</div>

							{!!isConfirming && !!cart && cart?.checkoutUrl ? (
								<div className="animate-fadeIn">
									<AgeGateForm
										didCancel={() => setIsConfirming(false)}
										checkoutUrl={cart.checkoutUrl}
									/>
								</div>
							) : (
								<>
									{!cart || cart.lines.length === 0 ? (
										<div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
											<ShoppingBagIcon className="h-16" strokeWidth={1} />
											<p className="mt-6 text-center font-serif text-xl">
												Your shopping bag is empty.
											</p>
										</div>
									) : (
										<div className="flex h-full flex-col justify-between overflow-hidden p-1">
											<ul className="grow overflow-auto py-4">
												{cart.lines.map((item) => {
													const merchandiseSearchParams =
														{} as MerchandiseSearchParams;

													for (const { name, value } of item.merchandise
														.selectedOptions) {
														if (value !== DEFAULT_OPTION) {
															merchandiseSearchParams[name.toLowerCase()] =
																value;
														}
													}

													const merchandiseUrl = createUrl(
														`/product/${item.merchandise.product.handle}`,
														new URLSearchParams(merchandiseSearchParams),
													);

													return (
														<li
															key={item.id}
															className="flex w-full flex-col border-b border-white/20"
														>
															<div className="relative flex w-full flex-row justify-between px-1 py-4">
																<div className="absolute z-40 -mt-2 ml-[55px]">
																	<DeleteItemButton item={item} />
																</div>
																<Link
																	href={merchandiseUrl}
																	onClick={closeCart}
																	className="z-30 flex flex-row space-x-4"
																>
																	<div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-white/20 bg-white/40">
																		<Image
																			className="h-full w-full object-cover"
																			width={64}
																			height={64}
																			alt={
																				item.merchandise.product.featuredImage
																					.altText ||
																				item.merchandise.product.title
																			}
																			src={
																				item.merchandise.product.featuredImage
																					.url
																			}
																		/>
																	</div>

																	<div className="flex flex-1 flex-col text-base">
																		<span className="leading-tight">
																			{item.merchandise.product.title}
																		</span>
																		{item.merchandise.title !==
																		DEFAULT_OPTION ? (
																			<p className="text-sm text-white">
																				{item.merchandise.title}
																			</p>
																		) : null}
																	</div>
																</Link>
																<div className="flex h-16 flex-col justify-between">
																	<Price
																		className="flex justify-end space-y-2 text-right text-sm"
																		amount={item.cost.totalAmount.amount}
																		currencyCode={
																			item.cost.totalAmount.currencyCode
																		}
																	/>
																	<div className="ml-auto flex h-9 flex-row items-center rounded-full border border-white/20">
																		<EditItemQuantityButton
																			item={item}
																			type="minus"
																		/>
																		<p className="w-6 text-center">
																			<span className="w-full text-sm">
																				{item.quantity}
																			</span>
																		</p>
																		<EditItemQuantityButton
																			item={item}
																			type="plus"
																		/>
																	</div>
																</div>
															</div>
														</li>
													);
												})}
											</ul>
											{!!promotedItem && (
												<PromotedCartItem
													product={promotedItem}
													availableForSale={promotedItem.availableForSale}
												/>
											)}
											<div className="pb-4 pt-12 text-sm text-neutral-500 dark:text-neutral-400">
												<div className="mb-3 flex items-center justify-between border-b border-white/20 pb-1">
													<p>Taxes</p>
													<p className="text-right text-white/50">
														Calculated at checkout
													</p>
												</div>
												<div className="mb-3 flex items-center justify-between border-b border-white/20 py-1">
													<p>Shipping</p>
													<p className="text-right text-white/50">
														Calculated at checkout
													</p>
												</div>
												<div className="mb-3 flex items-center justify-between border-b border-white/20 py-1">
													<p>Total</p>
													<Price
														className="text-right text-base text-white"
														amount={cart.cost.totalAmount.amount}
														currencyCode={cart.cost.totalAmount.currencyCode}
													/>
												</div>
											</div>
											{ageConfirmed ? (
												<>
													<Link
														href={cart.checkoutUrl}
														className="block w-full border border-white/20 bg-dark px-12 py-6 text-center font-sans font-medium uppercase tracking-wider text-white transition-colors duration-300 hover:bg-white hover:text-black"
													>
														{t("cart.proceed")}
													</Link>
												</>
											) : (
												<>
													<button
														type="button"
														onClick={() => checkoutWithAgeCheck()}
														className="block w-full border border-white/20 bg-dark px-12 py-6 text-center font-sans font-medium uppercase tracking-wider text-white transition-colors duration-300 hover:bg-white hover:text-black"
													>
														{t("cart.proceed")}
													</button>
												</>
											)}
										</div>
									)}
								</>
							)}
						</Dialog.Panel>
					</Transition.Child>
				</Dialog>
			</Transition>
			{children}
		</CartProviderContext.Provider>
	);
}

export const useCart = () => {
	return useContext(CartProviderContext);
};
