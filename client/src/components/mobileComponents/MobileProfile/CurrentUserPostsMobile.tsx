import { Grid, Image } from "@chakra-ui/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  PostState,
  setPosts,
  setSinglePost,
} from "../../../redux-store/features/post/postsSlice";
import { useNavigate } from "react-router-dom";

const CurrentUserPostsMobile = () => {
  const dispatch = useAppDispatch();
  const currentUserPosts = useAppSelector((state) => state.posts.posts);

  useEffect(() => {
    const fetchCurrentUserPosts = async () => {
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
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };
    fetchCurrentUserPosts();
  }, [dispatch]);

  const navigate = useNavigate();

  const handleViewEachPost = (post: PostState) => {
    dispatch(setSinglePost(post));
    navigate(`/app/viewpost/${post.id}`);
  };

  return (
    <Grid templateColumns={"repeat(3, 1fr)"} gap={1} margin={"5px"}>
      {currentUserPosts
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
              onClick={() => handleViewEachPost(post)}
            />
          ))
        )}
    </Grid>
  );
};

export default CurrentUserPostsMobile;
