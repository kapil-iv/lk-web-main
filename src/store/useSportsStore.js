import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialState = {
  sportsGrounds: [],
  selectedGround: null,
  selectedSlots: [],
  selectedDate: null,
  totalPrice: 0,
  slotPrice: 0,
  availableSlots: [],
  bookings: [],
  loading: false,
  error: null,
  selectedSport: null,
  selectedDuration: null,
  selectedSportPrice: 0,
  sportsPricing: {},
  bookedData: null,
  categoryId: null,
};

const useSportsStore = create(
  persist(
    (set) => ({
      ...initialState,

      /* -------- Fetch Sports Grounds -------- */
      fetchSportsGroundsStart: () => set({ loading: true, error: null }),

      fetchSportsGroundsSuccess: (data) =>
        set({ sportsGrounds: data, loading: false, error: null }),

      fetchSportsGroundsFailure: (error) => set({ loading: false, error }),

      /* -------- Selection -------- */
      setSelectedGround: (ground) => set({ selectedGround: ground }),
      setSelectedSlots: (slots) => set({ selectedSlots: slots }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedSport: (sport) => set({ selectedSport: sport }),
      setSelectedDuration: (duration) => set({ selectedDuration: duration }),

      /* -------- Pricing -------- */
      setTotalPrice: (price) => set({ totalPrice: price }),
      setSlotPrice: (price) => set({ slotPrice: price }),
      setSelectedSportPrice: (price) => set({ selectedSportPrice: price }),
      setSportsPricing: (pricing) => set({ sportsPricing: pricing }),

      /* -------- Slots -------- */
      fetchAvailableSlotsStart: () => set({ loading: true, error: null }),

      fetchAvailableSlotsSuccess: (slots) =>
        set({ availableSlots: slots, loading: false, error: null }),

      fetchAvailableSlotsFailure: (error) => set({ loading: false, error }),

      /* -------- Bookings -------- */
      createBookingStart: () => set({ loading: true, error: null }),

      createBookingSuccess: (booking) =>
        set((state) => ({
          bookings: [...state.bookings, booking],
          loading: false,
          error: null,
        })),

      createBookingFailure: (error) => set({ loading: false, error }),

      fetchBookingsStart: () => set({ loading: true, error: null }),

      fetchBookingsSuccess: (bookings) =>
        set({ bookings, loading: false, error: null }),

      fetchBookingsFailure: (error) => set({ loading: false, error }),

      /* -------- Misc -------- */
      setBookedData: (data) => set({ bookedData: data }),
      setCategoryId: (id) => set({ categoryId: id }),

      clearSportsData: () =>
        set((state) => ({
          ...initialState,
          categoryId: state.categoryId, 
        })),
    }),
    {
      name: "sports-storage", // localStorage mein is naam se save hoga
      storage: createJSONStorage(() => localStorage), // default storage
      // Optional: Aap filter kar sakte hain ki kya save karna hai aur kya nahi
      partialize: (state) => ({
        selectedGround: state.selectedGround,
        selectedSlots: state.selectedSlots,
        selectedDate: state.selectedDate,
        selectedSport: state.selectedSport,
        totalPrice: state.totalPrice,
        categoryId: state.categoryId,
        bookedData: state.bookedData,
      }),
    }
  )
);

export default useSportsStore;