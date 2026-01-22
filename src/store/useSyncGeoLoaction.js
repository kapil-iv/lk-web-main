import { useEffect } from "react";
import useGeoLocation from "../hooks/useGeoLocation";
import useLatLngStore from "../store/useLatLngStore";

const useSyncGeoLocation = () => {
  const { lat, lng, loading, error } = useGeoLocation();
  const { setLocation, setError } = useLatLngStore();

  useEffect(() => {
    if (error) {
      setError(error);
      return;
    }

    if (!loading && lat && lng) {
      setLocation({ lat, lng });
      localStorage.setItem("lat-lng", JSON.stringify([lat, lng]));
    }
  }, [lat, lng, loading, error, setLocation, setError]);
};

export default useSyncGeoLocation;
