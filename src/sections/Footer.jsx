import { navLinks, socialImgs } from "../constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid #282732",
        background: "#0e0e10",
        marginTop: "0",
      }}
    >
      {/* ── Top section ── */}
      <div
        className="w-full md:px-20 px-6 pt-16 pb-10"
        style={{ maxWidth: "1280px", margin: "0 auto" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <a
              href="#hero"
              className="text-white text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              Jayant Garg
            </a>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#839cb5", maxWidth: "260px" }}
            >
              Full-stack developer based in India, crafting clean, efficient,
              and scalable web experiences.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4 mt-2">
              {socialImgs.map((img) => (
                <a
                  key={img.url}
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: "#1c1c21",
                    border: "1px solid #282732",
                  }}
                  aria-label={img.name}
                >
                  <img
                    src={img.imgPath}
                    alt={`${img.name} icon`}
                    className="w-5 h-5 object-contain rounded-full"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#839cb5" }}
            >
              Navigate
            </h4>
            <nav className="flex flex-col gap-3">
              {[{ name: "Home", link: "#hero" }, ...navLinks].map(
                ({ name, link }) => (
                  <a
                    key={name}
                    href={link}
                    className="text-sm w-fit transition-colors duration-200 hover:text-white"
                    style={{ color: "#d9ecff" }}
                  >
                    {name}
                  </a>
                ),
              )}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-4">
            <h4
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#839cb5" }}
            >
              Let's Connect
            </h4>
            <p className="text-sm" style={{ color: "#d9ecff" }}>
              Have a project in mind or just want to say hi?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 w-fit text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-300 hover:bg-white hover:text-black"
              style={{
                background: "#1c1c21",
                color: "white",
                border: "1px solid #282732",
              }}
            >
              Get in touch →
            </a>
            <a
              href="https://github.com/qjayant"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors duration-200 hover:text-white"
              style={{ color: "#839cb5" }}
            >
              github.com/qjayant
            </a>
            <a
              href="https://www.linkedin.com/in/qjayant/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors duration-200 hover:text-white"
              style={{ color: "#839cb5" }}
            >
              linkedin.com/in/qjayant
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid #282732" }}>
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 w-full md:px-20 px-6 py-5"
          style={{ maxWidth: "1280px", margin: "0 auto" }}
        >
          <p className="text-sm" style={{ color: "#839cb5" }}>
            © {currentYear} Jayant Garg. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#282732" }}>
            Built with React · Vite · TailwindCSS · GSAP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
