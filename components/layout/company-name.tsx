"use client";
import { useTranslations } from "next-intl";
const CompanyName = () => {
	const t = useTranslations("Index");

	return <span>{t("footer.companyName")}</span>;
};

export default CompanyName;
