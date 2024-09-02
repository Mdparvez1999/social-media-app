import { Box, Grid } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useDisclosure } from "@chakra-ui/react";
import ViewEachCurrentUserPost from "./ViewEachCurrentUserPost";
import { setPosts } from "../../redux-store/features/post/postsSlice";
import CustomCarousel from "../layouts/general/CustomCarousel";
import PostsSkeleton from "../../skeletons/profile/PostsSkeleton";

const CurrentUserPosts = () => {
  const dispatch = useAppDispatch();

  const currentUserPosts = useAppSelector((state) => state.posts.posts);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users/post/get-all", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (data.status === "fail" || data.status === "error") {
          throw new Error(data.message);
        }

        dispatch(setPosts(data.data));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUserPosts();
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
            images={post.files.map(
              (file) => `http://localhost:8000/uploads/postFiles/${file}`
            )}
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
