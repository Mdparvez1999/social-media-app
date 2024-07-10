import Feed from "../../components/feed/Feed";
import Suggestion from "../../components/suggestions/Suggestion";

const Home = () => {
  return (
    <>
      <div className="home_div">
        <div className="feed_box">
          <Feed />
        </div>
        <div className="suggestion_box">
          <Suggestion />
        </div>
      </div>
    </>
  );
};

export default Home;
