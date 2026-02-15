import GitHubSection from "@/components/GitHubSection/GitHubSection";
import Navbar from "@/components/Navbar/Navbar.component.";
import AboutMePage from "./aboutMe/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 mb-10">
      <Navbar />
      <GitHubSection username="kornpakSittikool" />
      <AboutMePage />
    </div>
  );
}
