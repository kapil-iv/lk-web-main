import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
// import MobileNav from "../MobileNav";

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      {/* <MobileNav /> */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
