import { Box, Grid, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useDisclosure } from "@chakra-ui/react";
import ViewEachCurrentUserPost from "./ViewEachCurrentUserPost";
import { setPosts } from "../../redux-store/features/post/postsSlice";
import CustomCarousel from "../layouts/general/CustomCarousel";
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

const CurrentUserPosts = () => {
  const dispatch = useAppDispatch();
  const currentUserPosts = useAppSelector((state) => state.posts.posts);

  const [loading, setLoading] = useState<boolean>(true);

  const { fetchGetObjectPresignedUrls } = useFetchGetObjectPresignedUrls();

  useEffect(() => {
    const fetchCurrentUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/users/post/get-all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const postsData = await response.json();

        if (postsData.status === "fail" || postsData.status === "error") {
          throw new Error(postsData.message);
        }

        dispatch(setPosts(postsData.data));

        const postFiles = postsData.data.flatMap(
          (post: PostState) => post.files
        );

        const preSignedUrlsData = await fetchGetObjectPresignedUrls(postFiles);

        const updatedPosts = postsData.data.map((post: PostState) => ({
          ...post,
          files: post.files.map((file: string) => {
            const url = preSignedUrlsData?.find((url: string) =>
              url.includes(file)
            );
            return url;
          }),
        }));

        dispatch(setPosts(updatedPosts));
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
    fetchCurrentUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const [postId, setPostId] = useState<string | null>(null);
  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleViewEachPost = useCallback(
    (id: string) => {
      setPostId(id);
      onOpen();
    },
    [onOpen]
  );

  const sortedPosts = useMemo(
    () =>
      currentUserPosts
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [currentUserPosts]
  );

  if (loading) return <PostsSkeleton />;

  if (currentUserPosts.length === 0) {
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
      >
        <Text fontSize="xl" fontWeight="bold">
          You haven't created any posts yet!
        </Text>
        <Text fontSize="md" color="gray.500" mt={2}>
          Start sharing your thoughts and moments by creating a post.
        </Text>
      </Box>
    );
  }

  return (
    <Grid
      templateColumns={"repeat(3, 1fr)"}
      gap={4}
      margin={"10px"}
      padding={"10px"}
    >
      {sortedPosts.map((post) => (
        <Box
          height={"100%"}
          key={post.id}
          cursor={"pointer"}
          onClick={() => handleViewEachPost(post.id)}
        >
          <CustomCarousel
            images={post.files.map((file) => file)}
            width={"500px"}
            height={"220px"}
          />
        </Box>
      ))}
      <ViewEachCurrentUserPost isOpen={isOpen} onClose={onClose} id={postId} />
    </Grid>
  );
};

export default CurrentUserPosts;
