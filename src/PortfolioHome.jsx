import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import Navbar from "./components/Navbar";
import TechStack from "./sections/TechStack";
import ExperienceTree from "./sections/ExperienceTree";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

// ... CTA Styles omitted for brevity ...
const catPrepCTAStyles = `
  .catprep-cta-section {
    padding: 60px 20px 80px;
    display: flex;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .catprep-cta-card {
    position: relative;
    max-width: 900px;
    width: 100%;
    padding: 56px 48px;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 50%, rgba(244, 63, 94, 0.12) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    text-align: center;
    overflow: hidden;
    transition: border-color 0.5s ease, transform 0.4s ease;
  }

  .catprep-cta-card:hover {
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-4px);
  }

  .catprep-cta-card::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 26px;
    background: conic-gradient(from 180deg, #6366f1, #a855f7, #f43f5e, #fb923c, #6366f1);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.5s ease;
    filter: blur(12px);
  }

  .catprep-cta-card:hover::before {
    opacity: 0.3;
  }

  /* Floating orbs */
  .catprep-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.4;
    animation: orbFloat 8s ease-in-out infinite;
    pointer-events: none;
  }

  .catprep-orb-1 {
    width: 200px; height: 200px;
    background: #6366f1;
    top: -60px; left: -40px;
    animation-delay: 0s;
  }

  .catprep-orb-2 {
    width: 160px; height: 160px;
    background: #a855f7;
    bottom: -50px; right: -30px;
    animation-delay: -4s;
  }

  .catprep-orb-3 {
    width: 120px; height: 120px;
    background: #f43f5e;
    top: 50%; left: 70%;
    animation-delay: -2s;
  }

  @keyframes orbFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.1); }
  }

  .catprep-cta-icon {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    font-size: 32px;
    animation: iconPulse 3s ease-in-out infinite;
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
  }

  @keyframes iconPulse {
    0%, 100% { box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3); }
    50% { box-shadow: 0 12px 48px rgba(99, 102, 241, 0.5); }
  }

  .catprep-cta-title {
    font-size: 32px;
    font-weight: 700;
    color: #f8fafc;
    margin: 0 0 12px;
    line-height: 1.2;
  }

  .catprep-cta-subtitle {
    font-size: 16px;
    color: #94a3b8;
    margin: 0 0 36px;
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .catprep-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 36px;
    border-radius: 16px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
    font-size: 17px;
    font-weight: 600;
    font-family: inherit;
    text-decoration: none;
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 24px rgba(99, 102, 241, 0.3);
  }

  .catprep-cta-btn:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 40px rgba(99, 102, 241, 0.5);
  }

  .catprep-cta-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .catprep-cta-btn:hover::after {
    opacity: 1;
  }

  .catprep-cta-arrow {
    display: inline-block;
    transition: transform 0.3s ease;
    font-size: 20px;
  }

  .catprep-cta-btn:hover .catprep-cta-arrow {
    transform: translateX(6px);
  }

  .catprep-cta-tags {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 28px;
    flex-wrap: wrap;
  }

  .catprep-cta-tag {
    padding: 6px 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #94a3b8;
    font-size: 13px;
    font-weight: 500;
  }

  @media (max-width: 640px) {
    .catprep-cta-card { padding: 40px 24px; }
    .catprep-cta-title { font-size: 24px; }
    .catprep-cta-subtitle { font-size: 14px; }
    .catprep-cta-btn { padding: 14px 28px; font-size: 15px; }
  }
`;

const CatPrepCTA = () => (
  <section id="catprep" className="catprep-cta-section">
    <style>{catPrepCTAStyles}</style>
    <div className="catprep-cta-card">
      {/* Floating ambient orbs */}
      <div className="catprep-orb catprep-orb-1" />
      <div className="catprep-orb catprep-orb-2" />
      <div className="catprep-orb catprep-orb-3" />

      <div className="catprep-cta-icon">📚</div>

      <h2 className="catprep-cta-title">Built My Own CAT Prep Suite</h2>
      <p className="catprep-cta-subtitle">
        A full-stack study companion with personalized plans, analytics
        dashboard, achievement tracking, and an IIM call predictor — all built
        with React.
      </p>

      <Link to="/catprep" className="catprep-cta-btn">
        Explore CAT Prep
        <span className="catprep-cta-arrow">→</span>
      </Link>

      <div className="catprep-cta-tags">
        <span className="catprep-cta-tag">Study Planner</span>
        <span className="catprep-cta-tag">Analytics</span>
        <span className="catprep-cta-tag">IIM Predictor</span>
        <span className="catprep-cta-tag">Achievements</span>
      </div>
    </div>
  </section>
);

const PortfolioHome = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Reset the browser tab title when returning to the portfolio from CAT Prep
  React.useEffect(() => {
    document.title = "Jayant Garg - Full Stack Developer | MYcat Prep Provider";
    let meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Portfolio of Jayant Garg, a Full Stack Developer. Explore the MYcat CAT Exam Preparation module featuring an IIM Call Predictor, Study Plan, and Analytics Dashboard.",
      );
    }
  }, []);

  return (
    <>
      <motion.div
        className="progress-bar"
        style={{
          scaleX,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background:
            "linear-gradient(90deg, #62e0ff, #52aeff, #fd5c79, #6d45ce)",
          transformOrigin: "0%",
          zIndex: 1000,
        }}
      />
      <Navbar />
      <Hero />
      <ShowcaseSection />
      <TechStack />
      <ExperienceTree />
      <CatPrepCTA />
      <Contact />
      <Footer />
    </>
  );
};

export default PortfolioHome;
