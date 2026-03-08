import React, { Suspense, lazy } from "react";
import { words } from "../constants";
import Button from "../components/Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimatedCounter from "../components/AnimatedCounter";

// Lazy load the heavy 3D model component
const HeroExperience = lazy(
  () => import("../components/HeroModels/HeroExperience"),
);

// Sleek loading fallback for the 3D model
const ModelLoader = () => (
  <div className="flex-center w-full h-full min-h-[50vh]">
    <div className="relative flex justify-center items-center">
      <div className="absolute w-16 h-16 border-4 border-white-50/20 rounded-full animate-ping"></div>
      <div className="absolute w-12 h-12 border-4 border-t-blue-50 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <span className="text-white-50 text-sm font-medium mt-24 tracking-widest uppercase">
        Loading Asset
      </span>
    </div>
  </div>
);

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 1,
        duration: 2,
        ease: "power2.inOut",
      },
    );
  });
  return (
    <section id="hero" className="relative overflow-hidden ">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.webp" alt="background" />
      </div>
      <div className="hero-layout">
        {/* left content */}
        <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5 ">
          <div className="flex flex-col gap-7">
            <div className="hero-text ">
              <h1>
                Shaping
                <span className="slide">
                  <span className="wrapper">
                    {words.map((word, index) => (
                      <span
                        key={index}
                        className="flex items-center md:gap-3 gap-1 pb-2"
                      >
                        <img
                          src={word.imgPath}
                          alt={word.text}
                          className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50"
                        />
                        <span>{word.text}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </h1>
              <h1>into Real Projects</h1>
              <h1>That Delivers Result</h1>
            </div>
            <p className="text-white-50 2xl:text-xl md:text-lg relative z-10 pointer-events-none">
              Hi, i'm Jayant, a developer based in India with a Passion for
              <span className="text-amber-200"> Code.</span>
            </p>
            <Button
              className="md:w-80 md:h-16 w-60 h-12"
              id="button"
              text="See my Work"
            />
          </div>
        </header>

        {/* Right 3D model  */}
        <figure>
          <div className="hero-3d-layout">
            <Suspense fallback={<ModelLoader />}>
              <HeroExperience />
            </Suspense>
          </div>
        </figure>
      </div>
      <AnimatedCounter />
    </section>
  );
};

export default Hero;
