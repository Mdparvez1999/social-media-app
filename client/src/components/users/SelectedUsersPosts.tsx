import { Grid, Image, Text, useDisclosure } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useEffect, useState } from "react";
import { setSelectedUsersPosts } from "../../redux-store/features/users/userSlice";
import { toast } from "react-toastify";
import ViewSelectedUsersPost from "./ViewSelectedUsersPost";

const SelectedUsersPosts = () => {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  const selectedUserPosts = useAppSelector(
    (state) => state.users.selectedUsersPosts
  );

  const [loading, setLoading] = useState(false);

  const [postId, setPostId] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
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

        const { data } = await response.json();

        if (data.status === "fail" || data.status === "error") {
          throw new Error(data.message);
        }

        dispatch(setSelectedUsersPosts(data));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (selectedUser?.id) {
      fetchCurrentUserPosts();
    }
  }, [dispatch, selectedUser?.id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const handleViewEachPost = (id: string) => {
    setPostId(id);
    onOpen();
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4} margin="10px" padding="10px">
      {selectedUserPosts.length > 0 ? (
        selectedUserPosts
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post) =>
            post.files.map((file) => (
              <Image
                src={`http://localhost:8000/uploads/postFiles/${file}`}
                w="100%"
                h="100%"
                key={`${post.id}-${file}`}
                objectFit="cover"
                crossOrigin="anonymous"
                cursor="pointer"
                onClick={() => handleViewEachPost(post.id)}
              />
            ))
          )
      ) : (
        <Text fontSize="2xl" m={"60px 0 0 300px"} w={"100%"}>
          No posts
        </Text>
      )}
      <ViewSelectedUsersPost isOpen={isOpen} onClose={onClose} id={postId} />
    </Grid>
  );
};

export default SelectedUsersPosts;
