import { create } from "zustand";

const useLatLngStore = create((set) => ({
  lat: null,
  lng: null,
  locationLoading: true,
  error: null,

  setLocation: ({ lat, lng }) =>
    set({ lat, lng, locationLoading: false }),

  setError: (error) =>
    set({ error, locationLoading: false }),
}));

export default useLatLngStore;
