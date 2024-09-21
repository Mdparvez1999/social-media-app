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
import useFetchGetObjectPresignedUrls from "../../../hooks/post/useFetchGetObjectPresignedUrls";

const CurrentUserPostsMobile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUserPosts = useAppSelector((state) => state.posts.posts);

  const [loading, setLoading] = useState<boolean>(true);

  const { fetchGetObjectPresignedUrls } = useFetchGetObjectPresignedUrls();

  useEffect(() => {
    const fetchCurrentUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users/post/get-all", {
          method: "GET",
          credentials: "include",
        });

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
            images={post.files.map((file) => file)}
            width={"500px"}
            height={"85px"}
          />
        </Box>
      ))}
    </Grid>
  );
};

export default CurrentUserPostsMobile;
