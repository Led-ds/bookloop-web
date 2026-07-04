import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { CommunityProvider } from "./data/CommunityProvider";
import { LandingHeader } from "./components/LandingHeader";
import { Hero } from "./components/Hero";
import { Manifesto } from "./components/Manifesto";
import { HowItWorks } from "./components/HowItWorks";
import { TrustReputation } from "./components/TrustReputation";
import { CommunityStats } from "./components/CommunityStats";
import { CommunityActivity } from "./components/CommunityActivity";
import { LivingBooks } from "./components/LivingBooks";
import { FinalCTA } from "./components/FinalCTA";
import { LandingFooter } from "./components/LandingFooter";

export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // Quem já tem sessão vai direto para a aplicação — a landing é a porta pública.
  if (isAuthenticated) return <Navigate to="/app" replace />;

  return (
    <CommunityProvider>
      <div className="min-h-screen bg-white">
        <LandingHeader />
        <main>
          <Hero />
          <Manifesto />
          <HowItWorks />
          <TrustReputation />
          <CommunityStats />
          <CommunityActivity />
          <LivingBooks />
          <FinalCTA />
        </main>
        <LandingFooter />
      </div>
    </CommunityProvider>
  );
}

export default LandingPage;
