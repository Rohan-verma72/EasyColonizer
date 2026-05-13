import { useEffect } from "react";
import { SITE } from "../../config/site";

const SEO = ({ title, description, keywords, image, url }) => {
  useEffect(() => {
    document.title = `${title} | ${SITE.name} ${SITE.city}`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      description ||
        `Premium residential plots, villas, flats and commercial spaces in ${SITE.city}. Verified listings with transparent pricing and expert assistance.`,
    );

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      keywords ||
        `real estate ${SITE.city}, plots for sale ${SITE.city}, villas in ${SITE.city}, easy colonizer, buy property ${SITE.city}`,
    );

    const updateOGTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    updateOGTag("og:title", title);
    updateOGTag("og:description", description);
    updateOGTag(
      "og:image",
      image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
    );
    updateOGTag("og:url", url || window.location.href);
    updateOGTag("og:type", "website");
  }, [title, description, keywords, image, url]);

  return null;
};

export default SEO;
