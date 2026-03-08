# 🚀 Jayant Garg - Developer Portfolio & MYcat Prep Suite

![Portfolio Showcase](public/images/bg.webp)

A high-performance, interactive developer portfolio built with React, Vite, Tailwind CSS, and GSAP. This project is not just a standard portfolio—it also features **MYcat**, a full-fledged SaaS-style utility suite for CAT (Common Admission Test) aspirants in India.

---

## 🌟 Key Features

### 1. The Interactive Developer Portfolio

- **Stunning 3D Visuals & Glassmorphism:** Clean, modern UI using Tailwind CSS custom gradients and glass effects.
- **GSAP Animations:** Smooth scroll animations applied to the Experience Tree and Hero sections for a highly engaging user experience.
- **Responsive "Experience Tree":** A dynamically styled, responsive vertical timeline that stacks beautifully on mobile while maintaining an alternating structure on desktop.
- **Contact Integration:** Functional contact form integrated with EmailJS (and Web3Forms ready) for direct messages from recruiters.

### 2. The _MYcat_ Prep Suite

A fully integrated web app for MBA aspirants built directly into the portfolio (try navigating to `/catprep`):

- **Predictive Analytics Engine:** The **IIM Call Predictor** processes user demographics (Category, Gender, PwD), Academic Scores (10th/12th/Grad), and Work Experience. It calculates complex, weighted **Composite Scores** against historical minimum cutoffs for 45+ B-schools in India.
- **Gamified Pomodoro Timer:** Integrated study context with focus tracking.
- **Study Planner:** Dynamic exam planner that calculates remaining days to CAT and organizes study blocks.
- **Dashboard & Analytics:** Visualizes profile strengths and weaknesses.

### 3. Engine-Level SEO & Architecture

- **Schema Markup (JSON-LD):** Implements dynamic structured data for `Person` (Jayant Garg) and `WebApplication` (MYcat Predictor) to ensure rich Google search results.
- **Dynamic Meta Tags:** Custom React hooks (`usePageSEO`) that rewrite `<title>`, description, Open Graph, and Twitter metadata based on the current active module.
- **Crawling Ready:** Complete `robots.txt` and `sitemap.xml` configured for organic search indexing.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18, Vite
- **Styling:** Tailwind CSS (Custom Theme Variables)
- **Routing:** React Router DOM (v6)
- **Animations:** GSAP, Framer Motion
- **Icons:** Lucide React
- **Forms & Email:** EmailJS

---

## 🚀 Running the Project Locally

To test the application on your local machine:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/qjayant/Portfolio-website.git
   cd Portfolio-website
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables (Optional):**
   Create a `.env` file in the root if you wish to configure EmailJS.

   ```env
   VITE_APP_EMAILJS_SERVICE_ID=your_id
   VITE_APP_EMAILJS_TEMPLATE_ID=your_id
   VITE_APP_EMAILJS_PUBLIC_KEY=your_key
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   Open your browser to `http://localhost:5173/`

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🤝 Open Source & Feedback

Notice a data discrepancy in the Call Predictor model? IIM admission weights change frequently! Feel free to open an issue or submit a Pull Request to help improve the prediction algorithm.

_Built with ❤️ by Jayant Garg_
