import { About } from "@/widgets/about";
import { Contact } from "@/widgets/contact";
import { Education } from "@/widgets/education";
import { Experience } from "@/widgets/experience";
import { Hero } from "@/widgets/hero";
import { Skills } from "@/widgets/skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}
