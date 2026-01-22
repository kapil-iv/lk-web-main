import { useEffect, useState } from "react";

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        lat: null,
        lng: null,
        error: "Geolocation not supported",
        loading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        setLocation({
          lat: null,
          lng: null,
          error: err.message || "Permission denied",
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return location;
};

export default useGeoLocation;
