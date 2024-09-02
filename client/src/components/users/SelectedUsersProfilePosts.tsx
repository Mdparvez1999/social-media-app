import {
  Box,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import SelectedUsersPosts from "./SelectedUsersPosts";
import SelectedUsersSavedPosts from "./SelectedUsersSavedPosts";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useEffect, useState } from "react";
import { setSelectedUsersPosts } from "../../redux-store/features/users/userSlice";
import { toast } from "react-toastify";
import PostsSkeleton from "../../skeletons/profile/PostsSkeleton";

const SelectedUsersProfilePosts = () => {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSelectedUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/users/post/get-all/${selectedUser?.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const { data } = await response.json();

        if (data.status === "fail" || data.status === "error") {
          throw new Error(data.message);
        }

        dispatch(setSelectedUsersPosts(data));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (selectedUser?.id) {
      fetchSelectedUserPosts();
    }
  }, [dispatch, selectedUser?.id]);

  return (
    <Box width={"100%"} minHeight={"10vh"}>
      <Tabs align="center" variant="unstyled" isLazy>
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Saved</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />

        <TabPanels>
          <TabPanel>
            {loading ? <PostsSkeleton /> : <SelectedUsersPosts />}
          </TabPanel>
          <TabPanel>
            <SelectedUsersSavedPosts />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SelectedUsersProfilePosts;
