import HomePage from "./pages/HomePage";
import EventDetails from "./pages/events/pages/EventDetails";
import TicketSelection from "./pages/events/pages/TicketSelection";
import BookingPage from "./pages/events/pages/BookingPage";
import SportsBookingPage from "./components/booking/BookingPage";
import BookingConfirmationPage from "./pages/events/pages/BookingConfirmationPage";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import DeleteAccount from "./pages/DeleteAccount";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import HomeLayout from "./components/layout/HomeLayout";
// import SportsLanding from "./pages/sports/features/home/Home"; // Unused?
// import SportsHome from "./pages/sports/features/home/Home";
// import Venues from "./pages/sports/features/book/Book";
import BookingSummary from "./components/booking/BookingSummary"
import BookingStatus from "./components/booking/BookingStatus"
import Sports from "./pages/sports/Sports"
import Home from "./pages/sports/features/home/Home";
import Play from "./pages/sports/features/play/Play";
import Book from "./pages/sports/features/book/Book";
import JoinGame from "./pages/sports/features/play/pages/JoinGame";
import CreateGame from "./components/CreateGame";
import MyGames from "./pages/sports/features/play/pages/MyGames";
import GameDetail from "./pages/sports/features/play/pages/GameDetail";

export const appRoutes = [
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },

      // --- EVENTS SECTION ---
      // { path: "events", element: <EventDetails /> },
      { path: "event/:id", element: <EventDetails /> },
      { path: "tickets/:id", element: <TicketSelection /> },
      { path: "booking/confirmation", element: <BookingConfirmationPage /> },
      { path: "book/:id", element: <BookingPage /> }, // Events generic booking

      // --- SPORTS SECTION (Grouped) ---
      {
        path: "sports",
        element: <Sports />,
        children: [
          { index: true, element: <Home /> },              // /sports
          { path: "play", element: <Play /> },             // /sports/play
          { path: "play/join-game/:id", element: <JoinGame /> },
          { path: "play/create-game", element: <CreateGame /> },
          { path: "play/game-detail", element: <GameDetail /> },
          { path: "play/my-games", element: <MyGames /> },
          { path: "book", element: <Book /> },             // /sports/book
          { path: "venue/:providerId", element: <SportsBookingPage /> },
          { path: "booking-summary", element: <BookingSummary /> },
          { path: "booking-status", element: <BookingStatus /> },
        ],
      },


      // --- COMMON PAGES ---
      { path: "success", element: <BookingStatus /> },
      { path: "team", element: <Team /> },
      { path: "contact", element: <Contact /> },
      { path: "delete-account", element: <DeleteAccount /> },
      { path: "terms", element: <Terms /> },
      { path: "privacy", element: <Privacy /> },
    ],
  },
];