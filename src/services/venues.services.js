import { getServiceProviders, getAllServiceCategories } from "../api/apiUtils";

// shared helper (no duplication)
const fetchProvidersByCategory = async ({ categoryId, lat, lng }) => {
  let res = await getServiceProviders({
    categoryId,
    lat,
    lng,
    maxDistance: 50000,
    status: "active",
    approval_status: "approved",
  });

  let list = Array.isArray(res) ? res : res?.data || [];

  // fallback radius
  if (list.length === 0) {
    res = await getServiceProviders({
      categoryId,
      lat,
      lng,
      maxDistance: 100000,
      status: "active",
      approval_status: "approved",
    });

    list = Array.isArray(res) ? res : res?.data || [];
  }

  return list;
};

// Sports (category 3)
export const fetchSportsVenues = async ({ lat, lng }) => {
  return fetchProvidersByCategory({
    categoryId: "3",
    lat,
    lng,
  });
};

// Fitness (category 8)
export const fetchFitnessVenues = async ({ lat, lng }) => {
  return fetchProvidersByCategory({
    categoryId: "8",
    lat,
    lng,
  });
};

// Sports categories
// Sports & Fitness categories only
export const fetchSportsCategories = async () => {
  const res = await getAllServiceCategories();

  const list = Array.isArray(res) ? res : res?.data || [];

  const filtered = list.filter(
    (d) => d.name === "Sports" || d.name === "Fitness"
  );

  return filtered;
};

