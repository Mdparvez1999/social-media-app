import { Box, Grid, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useEffect, useState } from "react";
import {
  setSelectedUsersPosts,
  setSelectedUsersSinglePost,
} from "../../../redux-store/features/users/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomCarouselForMobile from "../../layouts/general/CustomCarouselForMobile";
import PostsMobileSkeleton from "../../../mobileComponentSkeletons/PostsMobileSkeleton";
import useFetchGetObjectPresignedUrls from "../../../hooks/post/useFetchGetObjectPresignedUrls";
import { PostState } from "../../../redux-store/features/post/postsSlice";

const SelectedUsersAllPostsInMobile = () => {
  const dispatch = useAppDispatch();

  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const selectedUserPosts = useAppSelector(
    (state) => state.users.selectedUsersPosts
  );

  const [loading, setLoading] = useState<boolean>(false);

  const { fetchGetObjectPresignedUrls } = useFetchGetObjectPresignedUrls();

  useEffect(() => {
    const fetchCurrentUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_API_BASE_URL
          }/api/users/post/get-all/${selectedUser?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
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
          postLikes: post.postLikes || [],
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
      fetchCurrentUserPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedUser?.id]);

  const navigate = useNavigate();

  const handleViewEachPost = (post: PostState) => {
    dispatch(setSelectedUsersSinglePost(post));
    navigate(`/app/viewselecteduserspost/${post.id}`);
  };

  if (loading) return <PostsMobileSkeleton />;

  if (selectedUserPosts.length === 0) {
    return (
      <Box
        width={"100%"}
        height={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
        flexDirection={"column"}
        py={10}
        mt={5}
      >
        <Text fontSize="xl" fontWeight="bold">
          user haven't created any posts yet!
        </Text>
      </Box>
    );
  }

  return (
    <Grid templateColumns={"repeat(3, 1fr)"} gap={1} margin={"5px"}>
      {selectedUserPosts
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((post) => (
          <Box
            height={"100%"}
            key={post.id}
            cursor={"pointer"}
            onClick={() => handleViewEachPost(post)}
          >
            <CustomCarouselForMobile
              images={post.files.map((file) => `${file}`)}
              width={"500px"}
              height={"85px"}
            />
          </Box>
        ))}
    </Grid>
  );
};

export default SelectedUsersAllPostsInMobile;
