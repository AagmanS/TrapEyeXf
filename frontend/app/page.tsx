import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PixelDivider from "@/components/PixelDivider";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Bento from "@/components/Bento";
import Showcase from "@/components/Showcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">
      <Navbar />
      <Hero />
      <PixelDivider />
      <Features />
      <Stats />
      <Bento />
      <Showcase />
      <Footer />
    </main>
  );
}
