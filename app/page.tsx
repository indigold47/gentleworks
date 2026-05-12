import { HomeAboutView } from "@/components/home-about-view";
import { getAboutPage, getHomePage, getSiteSettings } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

const FALLBACK_IMAGE_URL =
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3165763e-5418-49cd-a0a5-c652b5f4158c/KI_optimist+hall-7-web+copy.jpg";

export default async function Home() {
  const [homeData, aboutData, settings] = await Promise.all([getHomePage(), getAboutPage(), getSiteSettings()]);

  const heroUrl = aboutData?.heroImage
    ? urlFor(aboutData.heroImage).width(1600).quality(80).auto("format").url()
    : FALLBACK_IMAGE_URL;

  return (
    <HomeAboutView
      startAt="home"
      heroMedia={homeData?.heroMedia ?? []}
      heroUrl={heroUrl}
      mainColor={aboutData?.theme?.mainColor}
      secondaryColor={aboutData?.theme?.secondaryColor}
      aboutBody={aboutData?.body ?? null}
      instagramUrl={settings?.instagramUrl}
      linkedinUrl={settings?.linkedinUrl}
    />
  );
}
