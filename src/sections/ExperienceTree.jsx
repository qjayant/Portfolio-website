import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TitleHeader from "../components/TitleHeader";
import { experienceItems } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const ExperienceTree = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Animate the vertical stem line growing upward
    gsap.fromTo(
      ".timeline-stem",
      { scaleY: 0, transformOrigin: "bottom" },
      {
        scaleY: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      },
    );

    // Animate horizontal connectors
    gsap.fromTo(
      ".timeline-connector",
      { scaleX: 0 },
      {
        scaleX: 1.3,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      },
    );

    // Animate cards fading in from sides
    gsap.fromTo(
      ".timeline-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      },
    );

    // Animate dots
    gsap.fromTo(
      ".timeline-dot",
      { scale: 0 },
      {
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      },
    );
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="My Experience & Journey"
          sub="🌳 From roots to branches — how I've grown"
        />

        {/* Timeline Tree Container */}
        <div className="relative mt-20 flex flex-col items-center">
          {/* Vertical Stem Line — hidden on mobile, visible on md+ */}
          <div
            className="timeline-stem hidden md:block absolute left-1/2 -translate-x-1/2 w-[2px] top-0 bottom-0"
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,0.6), rgba(255,255,255,0.1))",
              borderRadius: "99px",
            }}
          />

          {/* Tree Nodes */}
          <div className="relative w-full flex flex-col gap-0 pb-12">
            {experienceItems.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex items-center w-full mb-12 md:mb-16 ${
                    isLeft
                      ? "md:justify-start justify-center"
                      : "md:justify-end justify-center"
                  }`}
                >
                  {/* Card */}
                  <div
                    className={`timeline-card relative w-[90%] md:w-[42%] ${
                      isLeft ? "md:pr-10" : "md:pl-10"
                    }`}
                  >
                    <div
                      className="card-border rounded-2xl p-5 md:p-6 transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: "#0e0e10",
                      }}
                    >
                      {/* Top row: icon + date badge */}
                      <div className="flex items-center gap-3 mb-3">
                        {item.icon && (
                          <span className="text-2xl">{item.icon}</span>
                        )}
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            background: "#1c1c21",
                            color: "#d9ecff",
                            border: "1px solid #282732",
                          }}
                        >
                          {item.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-bold text-lg mb-1 leading-tight">
                        {item.title}
                      </h3>

                      {/* Company — muted blue-grey */}
                      <p
                        className="text-sm font-semibold mb-3"
                        style={{ color: "#839cb5" }}
                      >
                        {item.company}
                      </p>

                      {/* Description - Added break-words to handle long links/text */}
                      <p className="text-white-50 text-sm leading-relaxed break-words">
                        {item.description}
                      </p>

                      {/* Tags */}
                      {item.tags && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                background: "#1c1c21",
                                color: "#839cb5",
                                border: "1px solid #282732",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Central dot — hidden on mobile, visible on md+ */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10">
                    <div
                      className="timeline-dot w-4 h-4 rounded-full border-[3px] border-black"
                      style={{
                        background: "white",
                        boxShadow: "0 0 12px rgba(255,255,255,0.7)",
                      }}
                    />
                  </div>

                  {/* Horizontal Connector Line — hidden on mobile, visible on md+ */}
                  <div
                    className={`timeline-connector hidden md:block absolute top-1/2 h-[1px] w-[8%] ${
                      isLeft
                        ? "left-1/2 -translate-x-full"
                        : "right-1/2 translate-x-full"
                    }`}
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))",
                      transformOrigin: isLeft ? "right" : "left",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Root node at the bottom - hidden on mobile, visible on md+ */}
          <div
            className="relative z-10 hidden md:flex flex-col items-center gap-3"
            style={{ marginTop: "-1.5rem" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg border border-white/20"
              style={{
                background: "#1c1c21",
                boxShadow: "0 0 20px rgba(255,255,255,0.15)",
              }}
            >
              🌱
            </div>
            <p
              className="text-sm font-medium tracking-wider uppercase"
              style={{ color: "#839cb5" }}
            >
              The Beginning
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceTree;
