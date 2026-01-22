// src/pages/sports/Sports.jsx
import { Outlet } from "react-router-dom";
import Header from "./features/sports-header/Header";
const SportsLanding = () => {
  return (
    <div>
      <Header />
      {/* <h1>Sports</h1> */}
      {/* sports tabs / filters etc */}

      <Outlet /> {/* 👈 second outlet */}
    </div>
  );
};

export default SportsLanding;
