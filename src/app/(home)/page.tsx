import { About } from "@/widgets/about";
import { Contact } from "@/widgets/contact";
import { Education } from "@/widgets/education";
import { Experience } from "@/widgets/experience";
import { Footer } from "@/widgets/footer";
import { Hero } from "@/widgets/hero";
import { Skills } from "@/widgets/skills";

export default function Home() {
  return (
    // Two columns on desktop: the sticky Hero on the left, the sections scrolling on the right.
    <div className="mx-auto max-w-6xl px-4 sm:px-10 lg:flex lg:justify-between lg:gap-16 lg:px-12">
      <Hero />
      <div className="lg:min-w-0 lg:flex-1">
        <main id="main" className="space-y-24 pt-16 pb-24 lg:space-y-32 lg:pt-16">
          <About />
          <Experience />
          <Skills />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
