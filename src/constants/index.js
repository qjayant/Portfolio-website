const navLinks = [
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Skills",
    link: "#skills",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "CAT Prep",
    link: "#catprep",
  },
];

const words = [
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
];

const counterItems = [
  { value: 1, suffix: "+", label: "Years of Experience" },
  { value: 2, suffix: "+", label: "Satisfied Clients" },
  { value: 5, suffix: "+", label: "Completed Projects" },
  { value: 100, suffix: "%", label: "Client Retention Rate" },
];

const logoIconsList = [
  {
    imgPath: "/images/logos/company-logo-1.webp",
  },
  {
    imgPath: "/images/logos/company-logo-2.webp",
  },
  {
    imgPath: "/images/logos/company-logo-3.webp",
  },
  {
    imgPath: "/images/logos/company-logo-4.webp",
  },
  {
    imgPath: "/images/logos/company-logo-5.webp",
  },
  {
    imgPath: "/images/logos/company-logo-6.webp",
  },
  {
    imgPath: "/images/logos/company-logo-7.webp",
  },
  {
    imgPath: "/images/logos/company-logo-8.webp",
  },
  {
    imgPath: "/images/logos/company-logo-9.webp",
  },
  {
    imgPath: "/images/logos/company-logo-10.webp",
  },
  {
    imgPath: "/images/logos/company-logo-11.webp",
  },
];

const abilities = [
  {
    imgPath: "/images/seo.webp",
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: "/images/chat.webp",
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: "/images/time.webp",
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];

const techStackImgs = [
  {
    name: "React Developer",
    imgPath: "/images/logos/react.webp",
  },
  {
    name: "Python Developer",
    imgPath: "/images/logos/python.svg",
  },
  {
    name: "Backend Developer",
    imgPath: "/images/logos/node.webp",
  },
  {
    name: "Tailwind Css",
    imgPath: "/images/logos/tailwind.webp",
  },
  {
    name: "Project Manager",
    imgPath: "/images/logos/git.svg",
  },
  {
    name: "HTML",
    imgPath: "/images/logos/html.webp",
  },
  {
    name: "CSS",
    imgPath: "/images/logos/css.webp",
  },
  {
    name: "javaScript",
    imgPath: "/images/logos/js.webp",
  },
  {
    name: "Database",
    imgPath: "/images/logos/sql.webp",
  },
  {
    name: "Cpp developer",
    imgPath: "/images/logos/cpp.webp",
  },
];

const techStackIcons = [
  {
    name: "React Developer",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Python Developer",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "Backend Developer",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Interactive Developer",
    modelPath: "/models/tailwind.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Project Manager",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
];

const expCards = [
  {
    review:
      "Adrian brought creativity and technical expertise to the team, significantly improving our frontend performance. His work has been invaluable in delivering faster experiences.",
    imgPath: "/images/exp1.webp",
    logoPath: "/images/logo1.webp",
    title: "Frontend Developer",
    date: "January 2023 - Present",
    responsibilities: [
      "Developed and maintained user-facing features for the Hostinger website.",
      "Collaborated closely with UI/UX designers to ensure seamless user experiences.",
      "Optimized web applications for maximum speed and scalability.",
    ],
  },
  {
    review:
      "Adrian’s contributions to Docker's web applications have been outstanding. He approaches challenges with a problem-solving mindset.",
    imgPath: "/images/exp2.webp",
    logoPath: "/images/logo2.webp",
    title: "Full Stack Developer",
    date: "June 2020 - December 2023",
    responsibilities: [
      "Led the development of Docker's web applications, focusing on scalability.",
      "Worked with backend engineers to integrate APIs seamlessly with the frontend.",
      "Contributed to open-source projects that were used with the Docker ecosystem.",
    ],
  },
  {
    review:
      "Adrian’s work on Appwrite’s mobile app brought a high level of quality and efficiency. He delivered solutions that enhanced our mobile experience & meet our product goals.",
    imgPath: "/images/exp3.webp",
    logoPath: "/images/logo3.webp",
    title: "React Native Developer",
    date: "March 2019 - May 2020",
    responsibilities: [
      "Built cross-platform mobile apps using React Native, integrating with Appwrite's backend services.",
      "Improved app performance and user experience through code optimization and testing.",
      "Coordinated with the product team to implement features based on feedback.",
    ],
  },
];

const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.webp",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.webp",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.webp",
  },
];

const testimonials = [
  {
    name: "Esther Howard",
    mentions: "@estherhoward",
    review:
      "I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.",
    imgPath: "/images/client1.webp",
  },
  {
    name: "Wade Warren",
    mentions: "@wadewarren",
    review:
      "Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.",
    imgPath: "/images/client3.webp",
  },
  {
    name: "Guy Hawkins",
    mentions: "@guyhawkins",
    review:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    imgPath: "/images/client2.webp",
  },
  {
    name: "Marvin McKinney",
    mentions: "@marvinmckinney",
    review:
      "Adrian was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
    imgPath: "/images/client5.webp",
  },
  {
    name: "Floyd Miles",
    mentions: "@floydmiles",
    review:
      "Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional!",
    imgPath: "/images/client4.webp",
  },
  {
    name: "Albert Flores",
    mentions: "@albertflores",
    review:
      "Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend and backend dev are top-notch.",
    imgPath: "/images/client6.webp",
  },
];

const socialImgs = [
  {
    name: "insta",
    url: "https://www.instagram.com/qjayant/",
    imgPath: "/images/insta.webp",
  },
  {
    name: "github",
    url: "https://github.com/qjayant",
    imgPath: "/images/github.webp",
  },
  // {
  //   name: "Leetcode",
  //   url: "https://www.instagram.com/qjayant/",
  //   imgPath: "/images/x.webp",
  // },
  {
    name: "linkedin",
    url: "https://www.linkedin.com/in/qjayant/",
    imgPath: "/images/linkedin.webp",
  },
];

const experienceItems = [
 
  {
    icon: "💼",
    date: "Jan 2026 - Present",
    title: "Operations Analyst",
    company: "SCC | Military Eningeering Service",
    description:
      "Digitization of operations and builing custom software solutions for my firm.",
    tags: ["Python", "Excel", "Automation"],
  },
  {
    icon: "📊",
    date: "2026",
    title: "CAT Prep Suite",
    company: "Personal Project",
    description:
      "Built a data-driven CAT exam preparation web app featuring an AI call predictor, personalized study planner, achievement badges, and detailed analytics dashboard.",
    tags: ["React", "LocalStorage", "Data Analytics"],
  },
  {
    icon: "💼",
    date: "Oct 2025 - Jan 2026",
    title: "Software Development Internship",
    company: "tecHindustan",
    description:
      "Contributed to a large-scale SaaS platform, developed REST APIs, fixed performance bottlenecks, and shipped a feature used by 100k+ users daily.",
    tags: ["React", "Node.js", "MongoDB", "MaterialUi"],
  },
  {
    icon: "🚀",
    date: "2025",
    title: "Built GreenCart",
    company: "Personal Project",
    description:
      "A full-stack e-commerce grocery ordering platform with cart management, authentication, and real-time inventory updates.",
    tags: ["React", "JavaScript", "TailwindCSS"],
  },
   {
    icon: "🎓",
    date: "2021 – 2025",
    title: "B.Tech in Computer Science",
    company: "Thapar Institute of Engineernig and Technology",
    description:
      "Pursued a degree in Computer Science, where I built a strong foundation in data structures, algorithms, and full-stack development. Worked on multiple real-world projects alongside academics.",
    tags: ["DSA", "DBMS", "OS", "Computer Networks"],
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
  experienceItems,
};
