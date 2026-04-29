import { HomeAboutView } from "@/components/home-about-view";
import { getAboutPage } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

const FALLBACK_IMAGE_URL =
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3165763e-5418-49cd-a0a5-c652b5f4158c/KI_optimist+hall-7-web+copy.jpg";

export default async function Home() {
  const data = await getAboutPage();

  const heroUrl = data?.heroImage
    ? urlFor(data.heroImage).width(1600).quality(80).auto("format").url()
    : FALLBACK_IMAGE_URL;

  const mainColor = data?.theme?.mainColor;

  return (
    <HomeAboutView
      startAt="home"
      heroUrl={heroUrl}
      mainColor={mainColor}
      aboutBody={data?.body ?? null}
    />
  );
}
