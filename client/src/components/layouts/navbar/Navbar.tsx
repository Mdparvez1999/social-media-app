import Logo from "./Logo";
import Menu from "./Menu";
import "./Navbar.sass";

const Navbar = () => {
  return (
    <div className="navbar_div">
      <Logo />
      <Menu />
    </div>
  );
};

export default Navbar;
