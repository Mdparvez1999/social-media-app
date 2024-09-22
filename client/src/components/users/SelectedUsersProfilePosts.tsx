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
import useFetchGetObjectPresignedUrls from "../../hooks/post/useFetchGetObjectPresignedUrls";

interface PostState {
  id: string;
  caption: string;
  commentCount: number;
  likeCount: number;
  files: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    profilePic: string;
  };
  postLikes: string[];
}

const SelectedUsersProfilePosts = () => {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  const [loading, setLoading] = useState<boolean>(false);

  const { fetchGetObjectPresignedUrls } = useFetchGetObjectPresignedUrls();

  useEffect(() => {
    const fetchSelectedUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_API_BASE_URL
          }/api/users/post/get-all/${selectedUser?.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const postData = await response.json();

        if (postData.status === "fail" || postData.status === "error") {
          throw new Error(postData.message);
        }

        dispatch(setSelectedUsersPosts(postData.data));

        const postFiles = postData.data.flatMap(
          (post: PostState) => post.files
        );

        const preSignedUrls = await fetchGetObjectPresignedUrls(postFiles);

        const updatedPosts = postData.data.map((post: PostState) => ({
          ...post,
          files: post.files.map((file: string) => {
            const url = preSignedUrls?.find((url: string) =>
              url.includes(file)
            );
            return url;
          }),
        }));

        dispatch(setSelectedUsersPosts(updatedPosts));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    if (selectedUser?.id) {
      fetchSelectedUserPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
