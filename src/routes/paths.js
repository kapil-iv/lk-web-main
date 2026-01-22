export const paths = {
  auth: {
    login: "/login",
    register: "/register",
    verifyOtp: "/verify-otp",
  },
  home: "/",
  play: "/sports/play",
  train: "/train",
  book: "/book",
  dashboard: "/dashboard",
  payment: "/payment",
  joinGame: "/joingame",
  // Footer pages
  footer: {
    about: "/about",
    contact: "/contact",
    careers: "/careers",
    blog: "/blog",
  },
  // Sports routes
  sports: {
    home: (categoryId) => `/sports/${categoryId}`,
    groundListing: (categoryId) => `/sports/ground-listing/${categoryId}`,
    providerDetail: (providerId) => `/sports/venue/${providerId}`,
    slotBook: "/sports/slot-book",
    bookingSummary: "/sports/booking-summary",
    bookingStatus: "/sports/booking-status",
    serviceSelect: "/sports/service-select",
    bookingConfirm: "/sports/booking-confirm",
  },
  fitness: {
    home: (categoryId) => `/fitness/${categoryId}`,
    subscription: (categoryId) => `/fitness/subscription/${categoryId}`,
    slotSelection: "/fitness/slots-selection",
    bookingSummary: "/fitness/booking-summary",
    thanks: "/fitness/thanks",
  },
  myBookings: {
    list: "/my-bookings",
    cancel: "/cancel-booking",
  },
  // Other routes
  notFound: "*",
};
