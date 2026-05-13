export const SITE = {
  name: "Easy Colonizer",
  city: "Bhopal",

  phoneDisplay: "+91 91110 00000",
  phoneHref: "919111000000",
  whatsappNumber: "919111000000",
  email: "contact@easycolonizer.com",

  address: "Office No. 12, MP Nagar, Zone-II, Bhopal, MP - 462011",
  shortAddress: "MP Nagar, Bhopal",

  tagline: "Bhopal's Trusted Real Estate Partner",
  foundedYear: "2010",

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    whatsapp: "https://wa.me/919111000000",
  },

  seo: {
    title: "Easy Colonizer | Premium Properties in Bhopal",
    description:
      "Find verified plots, flats, villas, row houses & commercial properties in Bhopal with Easy Colonizer.",
    keywords:
      "Bhopal properties, plots in Bhopal, villas, flats, real estate, Easy Colonizer",
  },
};

export const whatsappLink = (message = "") => {
  return `https://wa.me/${
    SITE.whatsappNumber
  }?text=${encodeURIComponent(message)}`;
};

export const formatPrice = (price) => {
  if (!price) return "Price on Request";

  if (price >= 10000000) {
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  }

  return `₹ ${(price / 100000).toFixed(2)} L`;
};