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
import { PostState } from "../../../redux-store/features/post/postsSlice";
import PostsMobileSkeleton from "../../../mobileComponentSkeletons/PostsMobileSkeleton";

const SelectedUsersAllPostsInMobile = () => {
  const dispatch = useAppDispatch();

  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const selectedUserPosts = useAppSelector(
    (state) => state.users.selectedUsersPosts
  );

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/users/post/get-all/${selectedUser?.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.status === "fail" || data.status === "error") {
          throw new Error(data.message);
        }

        dispatch(setSelectedUsersPosts(data.data));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (selectedUser?.id) {
      fetchCurrentUserPosts();
    }
  }, [dispatch, selectedUser?.id]);

  const navigate = useNavigate();

  const handleViewEachPost = (post: PostState) => {
    dispatch(setSelectedUsersSinglePost(post));
    navigate(`/app/viewselecteduserspost/${post.id}`);
  };

  return loading ? (
    <PostsMobileSkeleton />
  ) : (
    <Grid templateColumns={"repeat(3, 1fr)"} gap={1} margin={"5px"}>
      {selectedUserPosts.length > 0 ? (
        selectedUserPosts
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
                images={post.files.map(
                  (file) => `http://localhost:8000/uploads/postFiles/${file}`
                )}
                width={"500px"}
                height={"85px"}
              />
            </Box>
          ))
      ) : (
        <Text fontSize="2xl" m={"60px 0 0 300px"} w={"100%"}>
          No posts
        </Text>
      )}
    </Grid>
  );
};

export default SelectedUsersAllPostsInMobile;
