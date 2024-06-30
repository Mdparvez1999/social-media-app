import "./App.sass";
import Hero from "./pages/hero/Hero";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router-dom";
import Search from "./pages/search/Search";
import CreatePost from "./pages/create post/CreatePost";
import Notifications from "./pages/notifications/Notifications";
import Profile from "./pages/profile/Profile";
import Chats from "./pages/chats/Chats";

function App() {
  return (
    <>
      <div className="app_div">
        <Routes>
          <Route path="/app" element={<Hero />}>
            <Route path="home" element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="createpost" element={<CreatePost />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chats" element={<Chats />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
