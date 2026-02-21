import { Metadata } from "next";
import { siteConfig } from "@/config/site";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const origin = (params?.origin as string) || "";
  const destination = (params?.destination as string) || "";

  const title = origin && destination
    ? `Flights from ${origin} to ${destination} – ${siteConfig.name}`
    : `Flight Search Results – ${siteConfig.name}`;

  const description = origin && destination
    ? `Find the best flight deals from ${origin} to ${destination}. Compare prices and book instantly via WhatsApp with ${siteConfig.name}.`
    : `Search and compare flight prices. Book instantly via WhatsApp with ${siteConfig.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: siteConfig.name,
    },
  };
}

export default function FlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
