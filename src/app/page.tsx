import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { PageBuilder } from "@/src/components/pagebuilder";
import { sanityFetch } from "@/src/sanity/lib/live";
import { queryHomePageData } from "@/src/sanity/lib/query";
import { getMetaData } from "@/src/sanity/utils/seo";
import { DashboardLanding } from "./_components/DashboardLanding";

async function fetchHomePageData() {
  return await sanityFetch({
    query: queryHomePageData,
  });
}

export async function generateMetadata() {
  const homePageData = await fetchHomePageData();
  return await getMetaData(homePageData?.data ?? {});
}

export default async function Page() {
  const { data: homePageData } = await fetchHomePageData();

  if (!homePageData) {
    return <DashboardLanding />;
  }

  const { _id, _type, pageBuilder } = homePageData ?? {};

  return <PageBuilder pageBuilder={pageBuilder ?? []} id={_id} type={_type} />;
}
