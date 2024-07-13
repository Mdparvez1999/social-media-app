import { Grid, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useDisclosure } from "@chakra-ui/react";
import ViewEachCurrentUserPost from "./ViewEachCurrentUserPost";
import { setPosts } from "../../redux-store/features/post/postsSlice";

const CurrentUserPosts = () => {
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

  const [postId, setPostId] = useState<string | null>(null);

  const { onOpen, isOpen, onClose } = useDisclosure();
  const handleViewEachPost = (id: string) => {
    setPostId(id);
    onOpen();
  };

  return (
    <Grid
      templateColumns={"repeat(3, 1fr)"}
      gap={4}
      margin={"10px"}
      padding={"10px"}
    >
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
              onClick={() => handleViewEachPost(post.id)}
            />
          ))
        )}
      <ViewEachCurrentUserPost isOpen={isOpen} onClose={onClose} id={postId} />
    </Grid>
  );
};

export default CurrentUserPosts;
