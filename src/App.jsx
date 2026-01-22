import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import AuthModal from "./components/AuthModal";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from 'react-hot-toast';
import { appRoutes } from "./routes.config";
import { renderRoutes } from "./renderRoutes";
import useSyncGeoloaction from "./store/useSyncGeoLoaction"

function App() {
  useSyncGeoloaction();
  return (<>
    <Toaster position="bottom-center" reverseOrder={false} />
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <ScrollToTop />

            <Routes>
              {renderRoutes(appRoutes)}
            </Routes>

            <AuthModal />
          </div>
        </Router>
      </EventProvider>
    </AuthProvider></>
  );
}

export default App;
