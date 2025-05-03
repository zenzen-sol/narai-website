"use client";

import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import CloseIcon from "components/icons/close";
import FacebookIcon from "components/icons/facebook";
import InstagramIcon from "components/icons/instagram";
import Logo from "components/icons/logo";
import MenuIcon from "components/icons/menu";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Fragment, Suspense, useRef, useState } from "react";
import { LanguageControl } from "../navbar/language-control";

export function MenuModal({ scrolled }: { scrolled: boolean }) {
	const t = useTranslations("Index");
	const locale = useLocale();
	const [isOpen, setIsOpen] = useState(false);
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	const close = () => {
		setIsOpen(false);
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="transition-all ease-in-out hover:scale-110"
				aria-label="Open menu"
			>
				<MenuIcon />
			</button>

			<Transition show={isOpen} as={Fragment}>
				<Dialog onClose={() => setIsOpen(false)}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 z-20" />
					</Transition.Child>

					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 z-30 bg-dark/80 backdrop-blur-sm">
							<Dialog.Panel>
								<div className="z-40 mx-auto max-w-screen-xl px-6">
									<div className="absolute left-6 top-2">
										<Logo className="h-[64px] w-[64px] md:h-[132px] md:w-[132px]" />
									</div>
									<div
										className={clsx(
											"flex flex-row justify-end space-x-6 px-2",
											scrolled ? "py-0" : "py-0 md:py-6",
										)}
									>
										<LanguageControl lang={locale} />

										<button
											ref={closeButtonRef}
											onClick={close}
											type="button"
											className="transition-opacity duration-150 hover:opacity-50"
										>
											<CloseIcon className="h-10 w-10 stroke-current transition-opacity duration-150 hover:opacity-50" />
										</button>
									</div>

									<Suspense fallback={null}>
										<div className="grid h-[calc(100vh-124px)] grid-cols-1 place-content-center">
											<div className="flex flex-row justify-end">
												<nav className="flex flex-col space-y-4 px-4 text-right">
													<div>
														<Link
															href="/products"
															className="font-serif text-4xl font-normal transition-opacity duration-150 hover:opacity-50"
														>
															{t("menu.products")}
														</Link>
													</div>

													<div>
														<Link
															href="/shop-list"
															className="font-serif text-4xl font-normal transition-opacity duration-150 hover:opacity-50"
														>
															{t("menu.shops")}
														</Link>
													</div>

													<div>
														<Link
															href="/about"
															className="font-serif text-4xl font-normal transition-opacity duration-150 hover:opacity-50"
														>
															{t("menu.about")}
														</Link>
													</div>

													<div>
														<Link
															href="/bar"
															className="font-serif text-4xl font-normal transition-opacity duration-150 hover:opacity-50"
														>
															{t("menu.bar")}
														</Link>
													</div>

													<div>
														<Link
															href="/concept"
															className="font-serif text-4xl font-normal transition-opacity duration-150 hover:opacity-50"
														>
															{t("menu.concept")}
														</Link>
													</div>

													{/* <div>
                          <Link
                            href="/stories"
                            className="font-serif text-4xl font-normal transition-opacity duration-150 hover:opacity-50"
                          >
                            {t('menu.stories')}
                          </Link>
                        </div> */}

													<div>
														<Link
															href="/company"
															className="font-serif text-4xl font-normal transition-opacity duration-150 hover:opacity-50"
														>
															{t("menu.company")}
														</Link>
													</div>

													<div className="pt-12">
														<Link
															href={`mailto:${t("email-address.support")}`}
															className="font-serif text-2xl font-extralight transition-opacity duration-150 hover:opacity-50"
														>
															{t("email-address.support")}
														</Link>
													</div>

													<div className="flex flex-row items-center justify-end space-x-6">
														<Link
															href="https://www.instagram.com/narai.sake/"
															className="group"
															rel="noopener noreferrer"
															target="_blank"
															aria-label="Visit on Instagram"
														>
															<InstagramIcon className="h-6 stroke-transparent transition-all ease-in-out group-hover:scale-110" />
														</Link>
														<Link
															href="https://www.facebook.com/narai.sake"
															className="group"
															rel="noopener noreferrer"
															target="_blank"
															aria-label="Visit on Facebook"
														>
															<FacebookIcon className="h-6 stroke-transparent transition-all ease-in-out group-hover:scale-110" />
														</Link>
													</div>
												</nav>
											</div>
										</div>
									</Suspense>
								</div>
							</Dialog.Panel>
						</div>
					</Transition.Child>
				</Dialog>
			</Transition>
		</>
	);
}
