import { Box, Button, Heading } from "@chakra-ui/react";
import Feed from "../../components/feed/Feed";
import Suggestion from "../../components/suggestions/Suggestion";
import { useAppDispatch } from "../../hooks/hooks";
import { useEffect } from "react";
import { fetchUserFeed } from "../../redux-store/features/feed/feedSlice";
import { AiOutlineMessage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserFeed());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate("/app/messagesinmobile");
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", md: "row" }}
        padding={{ xs: "0", md: "20px" }}
        gap={{ xs: "0", md: "20px" }}
      >
        <Box display={{ xs: "block", md: "none" }}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            p={"10px 4px 10px 22px"}
          >
            <Box>
              <Heading>SMA</Heading>
            </Box>
            <Box>
              <Button variant={"ghost"} onClick={handleMessageClick}>
                <AiOutlineMessage size={"2rem"} />
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          flex={1.8}
          borderRight={{ xs: "none", md: "1px solid #f2f2f2" }}
          display={"flex"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
        >
          <Feed />
        </Box>
        <Box flex={1} display={{ xs: "none", sm: "none", md: "block" }}>
          <Suggestion />
        </Box>
      </Box>
    </>
  );
};

export default Home;
