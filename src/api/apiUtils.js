import { axiosUser } from "./axiosInstance";
import axiosPublic from "./axiosPublic";
import { ENDPOINTS } from "./endpoints";

// --- PLAY MODULE / GAME ENDPOINTS ---

/**
 * 1. Host a Game (User A)
 * @param {Object} gameData - sportCategoryId, venueProviderId, gameType, skillLevel, gameDate, startTime, endTime, maxPlayers, pricePerPlayer, description
 */
export const hostGame = async (gameData) => {
  const response = await axiosUser.post(ENDPOINTS.hostGame, gameData);
  return response.data;
};

/**
 * 2. Discover Games (User B)
 * @param {Object} filters - date, sport_category_id (Optional)
 */
export const discoverGames = async (filters = {}) => {
  const params = {};
  if (filters.date) params.date = filters.date;
  if (filters.sport_category_id) params.sport_category_id = filters.sport_category_id;

  const response = await axiosUser.get(ENDPOINTS.discoverGames, { params });
  return response.data;
};

/**
 * 3. Join a Game (User B)
 * @param {number|string} gameId
 */
export const joinGame = async (gameId) => {
  if (!gameId) throw new Error("Game ID is required to join");
  const response = await axiosUser.post(ENDPOINTS.joinGame(gameId), {});
  return response.data;
};

/**
 * 5. Leave Game (User B)
 * @param {number|string} gameId
 */
export const leaveGame = async (gameId) => {
  if (!gameId) throw new Error("Game ID is required to leave");
  const response = await axiosUser.post(ENDPOINTS.leaveGame(gameId), {});
  return response.data;
};

/**
 * 6. Cancel Game (Host Only)
 * @param {number|string} gameId
 */
export const cancelGame = async (gameId) => {
  if (!gameId) throw new Error("Game ID is required to cancel");
  const response = await axiosUser.post(ENDPOINTS.cancelGame(gameId), {});
  return response.data;
};

export const getMyGames = async () => {
  const response = await axiosUser.get(ENDPOINTS.myGames);
  return response.data;
}

// public: get active banner ads
export const getBannerAds = async () => {
  const response = await axiosUser.get(ENDPOINTS.getBannerAds);
  return response.data;
};

// register user
export const registerUser = async (userData) => {
  const response = await axiosPublic.post(ENDPOINTS.customerRegister, userData);
  return response.data;
};

// get service providers
export const getServiceProviders = async ({
  lat,
  lng,
  maxDistance,
  categoryId,
  approval_status,
  status,
}) => {
  const headers = {
    "x-client-lat": lat,
    "x-client-lng": lng,
  };
  if (maxDistance) headers["x-max-distance"] = maxDistance;

  const params = {};
  if (approval_status) params.approval_status = approval_status;
  if (status) params.status = status;

  const response = await axiosPublic.get(
    ENDPOINTS.getServiceProviders(categoryId),
    {
      headers,
      params,
    }
  );
  return response.data;
};

// Get category details by ID
export const getCategoryById = async (id) => {
  if (!id) throw new Error("Category ID is required");
  const response = await axiosUser.get(ENDPOINTS.getCategoryById(id));
  return response.data;
};

// Get provider details by ID
export const getProviderById = async (id) => {
  if (!id) throw new Error("Provider ID is required");
  const response = await axiosUser.get(ENDPOINTS.getProviderById(id));
  return response.data;
};

// get all service categories
export const getAllServiceCategories = async (
  status = "active",
  attribute = true
) => {
  const params = {};
  if (status) params.status = status;
  if (attribute !== undefined) params.attribute = attribute;

  const response = await axiosPublic.get(ENDPOINTS.getAllServiceCategories, {
    params,
  });

  return response.data;
};

// get all service
export const getAllServices = async (
  categoryId,
  status = "active",
  approvalStatus = "approved",
  attributeId
) => {
  const params = {};
  if (categoryId) params.categoryId = categoryId;
  if (status) params.status = status;
  if (attributeId) params.attributeId = attributeId;
  if (approvalStatus !== undefined) params.approvalStatus = approvalStatus;
  const response = await axiosPublic.get(ENDPOINTS.getAllServices, {
    params,
  });
  return response.data;
};

// get service by id
export const getServiceById = async (id) => {
  if (!id) throw new Error("Service ID is required");
  const response = await axiosPublic.get(ENDPOINTS.getServiceById(id));
  return response.data;
};

// Get services for a provider by providerId
export const getProviderServices = async (providerId, options) => {
  if (!providerId) throw new Error("Provider ID is required");
  const params = {};
  if (options.status) params.status = options.status;
  if (options.approval_status) params.approval_status = options.approval_status;
  const response = await axiosUser.get(
    ENDPOINTS.getProviderServices(providerId),
    { params }
  );
  return response.data;
};

// Get available slots for a provider by providerId
export const getProviderSlots = async (providerId, options = {}) => {
  if (!providerId) throw new Error("Provider ID is required");
  if (!options.date) throw new Error("Date is required");
  const params = { date: options.date };
  if (options.serviceIds) params.serviceIds = options.serviceIds;
  if (options.staffIds) params.staffIds = options.staffIds;
  if (options.includeStaffAssignment !== undefined)
    params.includeStaffAssignment = options.includeStaffAssignment;
  const response = await axiosUser.get(ENDPOINTS.getProviderSlots(providerId), {
    params,
  });
  return response.data;
};

// get user's wallet
export const getUsersWallet = async () => {
  const response = await axiosUser.get(ENDPOINTS.getUserWallet);
  return response.data;
};

// get wallet summary category breakdown
export const getWalletSummaryCategoryBreakdown = async () => {
  const response = await axiosUser.get(
    ENDPOINTS.getWalletSummaryCategoryBreakdown
  );
  return response.data;
};

// create a booking
export const createBooking = async (body) => {
  const response = await axiosUser.post(ENDPOINTS.createBooking, body);
  return response.data;
};

// cancel booking
export const cancelBookingById = async (id, reason) => {
  if (!id) throw new Error("Booking ID is required");
  const response = await axiosUser.post(
    ENDPOINTS.cancelBookingById(id),
    reason
  );
  return response.data;
};

// get my bookings
export const getMyBooking = async ({ status, category }) => {
  const params = {};
  if (status) params.status = status;
  if (category && category !== "all") params.categoryId = category;
  const response = await axiosUser.get(ENDPOINTS.getMyBookings, { params });
  return response.data;
};

// get booking by id
export const getBookingById = async (id) => {
  if (!id) throw new Error("Booking ID is required");
  const response = await axiosUser.get(ENDPOINTS.getBookingById(id));
  return response.data;
};



// tooggle like status for a provider
export const toggleProviderLikeStatus = async (provider) => {
  const response = await axiosUser.post(
    ENDPOINTS.toggleProviderLikeStatus(provider)
  );
  return response.data;
};

// get provider likes status
export const getLikedStatusForProvider = async (providerId) => {
  const response = await axiosUser.get(
    ENDPOINTS.getLikedStatusForProvider(providerId)
  );
  return response.data;
};

// get current user
export const getCurrentUser = async () => {
  const response = await axiosUser.get(ENDPOINTS.getCurrUser);
  return response.data;
};


// get applicable discount for user
export const getApplicableDiscounts = async (body) => {
  const response = await axiosUser.post(ENDPOINTS.getApplicableDiscount, body);
  return response?.data;
};

// validate discount code
export const validateDiscountCode = async (body) => {
  const response = await axiosUser.post(ENDPOINTS.validateDiscountCode, body);
  return response?.data;
};

// apply discount code on bookings
export const applyDiscountCode = async (id, body) => {
  const response = await axiosUser.post(ENDPOINTS.applyDiscountCode(id), body);
  return response?.data;
};

// remove disocunt code on bookings
export const removeDiscountCode = async (id) => {
  const response = await axiosUser.delete(ENDPOINTS.removeDiscountCode(id));
  return response?.data;
};




