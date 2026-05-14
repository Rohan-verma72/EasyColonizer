export const SITE = {
  name: "Easy Colonizer",
  city: "",

  phoneDisplay: "+91 00000 00000",
  phoneHref: "910000000000",
  whatsappNumber: "910000000000",
  email: "contact@easycolonizer.com",

  address: "Premium Real Estate Solutions",
  shortAddress: "Your Trusted Partner",

  tagline: "Your Most Trusted Real Estate Partner",
  foundedYear: "2010",

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    whatsapp: "https://wa.me/910000000000",
  },

  seo: {
    title: "Easy Colonizer | Premium Properties",
    description:
      "Find verified plots, flats, villas, row houses & commercial properties with Easy Colonizer.",
    keywords:
      "properties, plots, villas, flats, real estate, Easy Colonizer",
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