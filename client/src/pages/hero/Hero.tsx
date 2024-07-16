import { Outlet } from "react-router-dom";
import Navbar from "../../components/layouts/navbar/Navbar";
import { Box } from "@chakra-ui/react";
import { useAppDispatch } from "../../hooks/hooks";
import useFetchFollowers from "../../hooks/profile/useFetchFollowers";
import useFetchFollowingUsers from "../../hooks/profile/useFetchFollowingUsers";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  setFollowers,
  setFollowingUsers,
} from "../../redux-store/features/profile/profileSlice";

const Hero = () => {
  const dispatch = useAppDispatch();

  const { fetchFollowers } = useFetchFollowers();
  const { fetchFollowingUsers } = useFetchFollowingUsers();

  useEffect(() => {
    const loadUsersData = async () => {
      try {
        const followersData = await fetchFollowers();
        dispatch(setFollowers(followersData));

        const followingData = await fetchFollowingUsers();
        dispatch(setFollowingUsers(followingData));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };

    loadUsersData();
  }, [dispatch, fetchFollowers, fetchFollowingUsers]);

  return (
    <Box display={"flex"}>
      <Box
        position={"fixed"}
        top={0}
        left={0}
        width={"220px"}
        zIndex={"1000"}
        boxShadow={"md"}
      >
        <Navbar />
      </Box>
      <Box marginLeft="200px" width="calc(100% - 200px)" pl={"20px"}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Hero;
