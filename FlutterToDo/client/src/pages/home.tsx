import Header from "@/components/layout/header";
import NewsSection from "@/components/financial/news-section";
import NavigationGrid from "@/components/financial/navigation-grid";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-md">
        <NewsSection />
        <NavigationGrid />
      </main>
    </div>
  );
}
