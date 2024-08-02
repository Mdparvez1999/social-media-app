import { Grid, Image } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useEffect } from "react";
import { setSelectedUsersPosts } from "../../../redux-store/features/users/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SelectedUsersAllPostsInMobile = () => {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  const selectedUserPosts = useAppSelector(
    (state) => state.users.selectedUsersPosts
  );

  useEffect(() => {
    const fetchCurrentUserPosts = async () => {
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
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };

    if (selectedUser?.id) {
      fetchCurrentUserPosts();
    }
  }, [dispatch, selectedUser?.id]);

  const navigate = useNavigate();

  const handleViewEachPost = (postId: string) => {
    navigate(`/app/viewselecteduserspost/${postId}`);
  };

  return (
    <Grid templateColumns={"repeat(3, 1fr)"} gap={1} margin={"5px"}>
      {selectedUserPosts
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((post) =>
          post.files.map((file) => (
            <Image
              src={`http://localhost:8000/uploads/postFiles/${file}`}
              w={"100%"}
              h={"100%"}
              key={`${post.id}-${file}`}
              objectFit={"cover"}
              crossOrigin="anonymous"
              cursor={"pointer"}
              onClick={() => handleViewEachPost(post.id)}
            />
          ))
        )}
    </Grid>
  );
};

export default SelectedUsersAllPostsInMobile;
