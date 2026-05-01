import { HomeAboutView } from "@/components/home-about-view";
import { getAboutPage, getHomePage } from "@/sanity/lib/fetch";

export default async function Home() {
  const [homeData, aboutData] = await Promise.all([getHomePage(), getAboutPage()]);

  return (
    <HomeAboutView
      startAt="home"
      heroMedia={homeData?.heroMedia ?? []}
      mainColor={aboutData?.theme?.mainColor}
      aboutBody={aboutData?.body ?? null}
    />
  );
}
