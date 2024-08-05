import { ChangeEvent, useState } from "react";
import { useAppDispatch } from "../../../hooks/hooks";
import { toast } from "react-toastify";
import { Box, Button, Input } from "@chakra-ui/react";
import { addComment } from "../../../redux-store/features/comments/commentsSlice";

const WriteCommentInMobile = ({ postId }: { postId: string }) => {
  const dispatch = useAppDispatch();

  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setComment(value);
  };

  const handleWriteComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(`/api/post/comments/write/${postId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const { data } = await response.json();

      // Dispatch action to add the new comment to the Redux state
      dispatch(addComment(data));

      setComment(""); // Clear the input field
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
      <Input
        width={{ xs: "75%", md: "80%" }}
        placeholder="Write a comment"
        name="comment"
        borderRadius={"10px"}
        onChange={handleChange}
        value={comment}
      />
      <Button
        borderRadius={"10px"}
        onClick={handleWriteComment}
        isLoading={loading}
      >
        Write
      </Button>
    </Box>
  );
};

export default WriteCommentInMobile;
