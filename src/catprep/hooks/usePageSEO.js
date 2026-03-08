import { useEffect } from "react";

/**
 * Sets document.title and meta description for SEO.
 * Call at top of each page component.
 *
 * @param {string} title - Page title (appended with " | MYcat")
 * @param {string} [description] - Meta description for the page
 */
export function usePageSEO(title, description) {
  useEffect(() => {
    document.title = `${title} | MYcat - CAT Exam Preparation`;

    // Update meta description
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      }
    }

    // Cleanup: restore default on unmount
    return () => {
      document.title = "Jayant Garg - Full Stack Developer | MYcat Prep Provider";
      let meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute(
          "content",
          "Portfolio of Jayant Garg, a Full Stack Developer. Explore the MYcat CAT Exam Preparation module featuring an IIM Call Predictor, Study Plan, and Analytics Dashboard.",
        );
      }
    };
  }, [title, description]);
}
