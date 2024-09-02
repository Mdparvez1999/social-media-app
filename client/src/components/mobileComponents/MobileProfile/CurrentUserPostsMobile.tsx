import { Box, Grid } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  PostState,
  setPosts,
  setSinglePost,
} from "../../../redux-store/features/post/postsSlice";
import { useNavigate } from "react-router-dom";
import CustomCarouselForMobile from "../../layouts/general/CustomCarouselForMobile";
import PostsMobileSkeleton from "../../../mobileComponentSkeletons/PostsMobileSkeleton";

const CurrentUserPostsMobile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const handleViewEachPost = (post: PostState) => {
    dispatch(setSinglePost(post));
    navigate(`/app/viewpost/${post.id}`);
  };

  const sortedPosts = useMemo(
    () =>
      currentUserPosts
        ?.slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [currentUserPosts]
  );

  return loading ? (
    <PostsMobileSkeleton />
  ) : (
    <Grid templateColumns={"repeat(3, 1fr)"} gap={1} margin={"5px"}>
      {sortedPosts.map((post) => (
        <Box
          height={"100%"}
          key={post.id}
          cursor={"pointer"}
          onClick={() => handleViewEachPost(post)}
        >
          <CustomCarouselForMobile
            images={post.files.map(
              (file) => `http://localhost:8000/uploads/postFiles/${file}`
            )}
            width={"500px"}
            height={"85px"}
          />
        </Box>
      ))}
    </Grid>
  );
};

export default CurrentUserPostsMobile;
