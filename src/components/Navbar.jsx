import { useState, useEffect } from "react";
import { navLinks } from "../constants";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Scrollspy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }, // Triggers when section is in top 30% of viewport
    );

    // Observe all sections defined in navLinks plus contact/hero
    const sections = [
      "hero",
      "contact",
      ...navLinks.map((link) => link.link.replace("#", "")),
    ];

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <a href="#hero" className="logo">
          Jayant Garg
        </a>

        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => {
              const targetId = link.replace("#", "");
              const isActive = activeSection === targetId;

              return (
                <li key={name} className="group flex items-center h-full">
                  <a
                    href={link}
                    className={`relative px-1 transition-colors duration-300 ${isActive ? "text-white" : "text-white-50"}`}
                  >
                    <span className="font-medium text-lg">{name}</span>
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          href="#contact"
          className={`contact-btn group ${activeSection === "contact" ? "scale-105" : ""}`}
        >
          <div
            className={`inner transition-all duration-300 ${activeSection === "contact" ? "bg-black-50 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" : ""}`}
          >
            <span>Contact me</span>
          </div>
        </a>
      </div>
    </header>
  );
};

export default NavBar;
