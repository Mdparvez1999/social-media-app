import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";
import { GoPlusCircle } from "react-icons/go";
import { IoNotifications } from "react-icons/io5";
import { BsChatSquareDotsFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

const Menu = () => {
  return (
    <>
      <div className="menu_div">
        <ul>
          <li>
            <Link to={"/app/home"}>
              <FaHome className="icons" />
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link to={"/app/search"}>
              <FaSearch className="icons" />
              Search
            </Link>
          </li>

          <li>
            <Link to={"/app/createpost"}>
              <GoPlusCircle className="icons" />
              Create Post
            </Link>
          </li>

          <li>
            <Link to={"/app/notifications"}>
              <IoNotifications className="icons" />
              Notifications
            </Link>
          </li>

          <li>
            <Link to={"/app/profile"}>
              <FaUserCircle className="icons" />
              Profile
            </Link>
          </li>

          <li>
            <Link to={"/app/chats"}>
              <BsChatSquareDotsFill className="icons" />
              Chats
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Menu;
