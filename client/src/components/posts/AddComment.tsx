import { Box, Button, Input } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/hooks";
import { addComment } from "../../redux-store/features/comments/commentsSlice";
import useFetchGetObjectProfilePicUrl from "../../hooks/profile/useFetchGetObjectProfilePicUrl";

interface PropsType {
  postId: string | undefined;
}
const AddComment = ({ postId }: PropsType) => {
  const [comment, setComment] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setComment(value);
  };

  const { fetchGetObjectProfilePicUrl } = useFetchGetObjectProfilePicUrl();

  const handleWriteComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/post/comments/write/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      const newComment = data.data;

      const profilePicUrl = await fetchGetObjectProfilePicUrl(
        newComment.user.profilePic
      );

      const updatedComment = {
        ...newComment,
        user: { ...newComment.user, profilePic: profilePicUrl },
      };

      setComment("");
      dispatch(addComment(updatedComment));
    } catch (error) {
      console.log(error);
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={"space-between"}
      my={"8px"}
    >
      <Input
        width={"78%"}
        ml={"2px"}
        placeholder="write a comment"
        name="comment"
        borderRadius={"10px"}
        value={comment}
        onChange={handleChange}
      />
      <Button
        borderRadius={"10px"}
        onClick={handleWriteComment}
        isLoading={loading}
        disabled={!comment.trim()}
      >
        write
      </Button>
    </Box>
  );
};

export default AddComment;
