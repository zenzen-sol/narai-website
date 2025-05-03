import { Lato, Noto_Serif_JP } from "next/font/google";
import localFont from "next/font/local";
import { type ReactNode, Suspense } from "react";

import { NextIntlClientProvider } from "next-intl";
import Analytics from "./analytics";
import "./globals.css";
import { CartProvider } from "components/cart/cart-provider";
import { getShopifyLocale } from "lib/locales";
import { getProduct } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import { getLocale } from "next-intl/server";

export const revalidate = 3600; // Revalidate pages every hour

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	robots: {
		follow: true,
		index: true,
	},
	...(TWITTER_CREATOR &&
		TWITTER_SITE && {
			twitter: {
				card: "summary_large_image",
				creator: TWITTER_CREATOR,
				site: TWITTER_SITE,
			},
		}),
};

// Font files can be colocated inside of `app`
const cinzel = localFont({
	src: "../fonts/Cinzel-Regular.ttf",
	display: "swap",
	variable: "--font-cinzel",
});

const alpina = localFont({
	src: [
		{
			path: "../fonts/GT-Alpina-Regular-Trial.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../fonts/GT-Alpina-Bold-Trial.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-alpina",
});

const lato = Lato({
	subsets: ["latin"],
	display: "swap",
	weight: ["300"],
	variable: "--font-lato",
});

const noto = Noto_Serif_JP({
	subsets: ["latin"],
	display: "swap",
	weight: ["200", "400", "600"],
	variable: "--font-noto",
});

export default async function RootLayout(props: {
	children: ReactNode;
}) {
	const { children } = props;
	// Validate that the incoming `locale` parameter is valid
	const locale = await getLocale();

	const promotedItem: Product | undefined = await getProduct({
		handle: "gift-bag-and-postcard-set",
		language: getShopifyLocale({ locale }),
	});

	return (
		<html
			lang={locale}
			className={`${cinzel.variable} ${alpina.variable} ${noto.variable} ${lato.variable}`}
		>
			<body className="bg-dark text-white selection:bg-green-800 selection:text-green-400">
				<NextIntlClientProvider>
					<Suspense fallback={null}>
						<Analytics />
					</Suspense>
					<CartProvider initialPromotedItem={promotedItem}>
						<main>{children}</main>
					</CartProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
