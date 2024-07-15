import { Box } from "@chakra-ui/react";
import Feed from "../../components/feed/Feed";
import Suggestion from "../../components/suggestions/Suggestion";
import { useAppDispatch } from "../../hooks/hooks";
import { useEffect } from "react";
import { fetchUserFeed } from "../../redux-store/features/feed/feedSlice";

const Home = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    let isMounted = true;
    console.log("home component mounted");
    if (isMounted) {
      dispatch(fetchUserFeed());
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
  return (
    <>
      <Box display={"flex"} padding={"20px"} gap={"20px"}>
        <Box
          flex={1.8}
          borderRight={"1px solid #f2f2f2"}
          display={"flex"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
        >
          <Feed />
        </Box>
        <Box flex={1}>
          <Suggestion />
        </Box>
      </Box>
    </>
  );
};

export default Home;
