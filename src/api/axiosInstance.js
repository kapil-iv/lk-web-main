import axios from "axios";

/* =====================================================
   Base Config
===================================================== */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const baseConfig = {
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

/* =====================================================
   Public Axios (NO AUTH REQUIRED)
===================================================== */
export const axiosPublic = axios.create(baseConfig);

/* =====================================================
   User Axios (OPTIONAL USER TOKEN)
===================================================== */
export const axiosUser = axios.create(baseConfig);

axiosUser.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lk_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================================
   Provider Axios (OPTIONAL PROVIDER TOKEN)
===================================================== */
export const axiosProvider = axios.create(baseConfig);

axiosProvider.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lk_provider_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
