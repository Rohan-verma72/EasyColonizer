export const normalizePropertiesResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.properties)) return data.properties;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const getPropertyImage = (property) => {
  return (
    property?.images?.[0] ||
    property?.featuredImage ||
    property?.image ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"
  );
};

export const getSavedWishlistIds = () => {
  try {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    return savedWishlist
      .map((item) => (typeof item === "object" ? item._id : item))
      .filter(Boolean);
  } catch {
    return [];
  }
};

export const saveWishlistIds = (ids) => {
  localStorage.setItem("wishlist", JSON.stringify([...new Set(ids)]));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const resolveWishlistProperties = (properties) => {
  const ids = getSavedWishlistIds();
  return ids
    .map((id) => properties.find((property) => property._id === id))
    .filter(Boolean);
};

export const propertySourceWithFallback = (items) => {
  return items || [];
};
