import { Outlet } from "react-router-dom";
import Navbar from "../../components/layouts/navbar/Navbar";
import "./Hero.sass";

const Hero = () => {
  return (
    <div className="hero_block">
      <div>
        <Navbar />
      </div>
      <Outlet />
    </div>
  );
};

export default Hero;
