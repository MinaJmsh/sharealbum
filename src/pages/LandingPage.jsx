import Navbar from "../components/landing/NavBar";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import AuthSection from "../components/landing/AuthSection";
import CTABanner from "../components/landing/CTABanner";
import Footer from "../components/landing/Footer";
import { globalStyles } from "../components/landing/LandingPageShared";
import { BubbleBackground } from "../components/animate-ui/components/backgrounds/bubble";
export default function LandingPage() {
  return (
    <>
      <style>{globalStyles}</style>

      <BubbleBackground
        interactive
        colors={{
          first: "201,168,124",
          second: "221,168,160",
          third: "168,191,160",
          fourth: "212,184,150",
          fifth: "232,197,192",
          sixth: "141,170,132",
        }}
        className="fixed inset-0 z-0 "
      />

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <HowItWorks />
          <Features />
          <AuthSection />
          <CTABanner />
        </main>
        <Footer />
      </div>
    </>
  );
}
