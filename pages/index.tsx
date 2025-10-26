import Hero from "../app/components/hero";
import GitHubSection from "../app/components/github-section";
import Footer from "../app/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <GitHubSection />
      <Footer />
    </main>
  );
} 