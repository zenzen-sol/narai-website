"use client";

import clsx from "clsx";
import { createNavigation } from "next-intl/navigation";

const locales = ["en", "ja", "zh"] as const;

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
	const index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr;
}

export const LanguageControl = ({ lang }: { lang?: string }) => {
	const { Link, usePathname } = createNavigation({ locales });
	const pathName = usePathname();

	const basePathName = () => {
		const unjoined = pathName.split("/");
		let unjoinedWithoutLocale = removeItem(unjoined, "en");
		unjoinedWithoutLocale = removeItem(unjoinedWithoutLocale, "ja");
		unjoinedWithoutLocale = removeItem(unjoinedWithoutLocale, "zh");

		return unjoinedWithoutLocale.join("/") || "/";
	};

	return (
		<div className="flex flex-row space-x-0">
			<span className="px-2 py-4">
				<Link
					href={basePathName()}
					className={clsx(
						lang === "ja" ? "opacity-100" : "opacity-50 hover:opacity-70",
						"transition-opacity duration-150",
					)}
					scroll={false}
					locale="ja"
				>
					日本
				</Link>
			</span>
			<span className="py-4">/</span>
			<span className="px-2 py-4">
				<Link
					href={basePathName()}
					className={clsx(
						lang === "en" ? "opacity-100" : "opacity-50 hover:opacity-70",
						"transition-opacity duration-150",
					)}
					scroll={false}
					locale="en"
				>
					EN
				</Link>
			</span>
			<span className="py-4">/</span>
			<span className="px-2 py-4">
				<Link
					href={basePathName()}
					className={clsx(
						lang === "zh" ? "opacity-100" : "opacity-50 hover:opacity-70",
						"transition-opacity duration-150",
					)}
					scroll={false}
					locale="zh"
				>
					中文
				</Link>
			</span>
		</div>
	);
};
