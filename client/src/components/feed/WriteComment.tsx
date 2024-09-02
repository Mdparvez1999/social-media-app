import { Box, Button, Input } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { toast } from "react-toastify";
import { addCommentToFeedPost } from "../../redux-store/features/feed/feedSlice";

const WriteComment = ({ postId }: { postId: string }) => {
  const dispatch = useAppDispatch();

  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setComment(value);
  };

  const handleWriteComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (comment.trim() === "") return toast.error("Comment cannot be empty");

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

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      dispatch(addCommentToFeedPost(data.data));

      setComment("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
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
        disabled={loading}
        isLoading={loading}
      >
        Write
      </Button>
    </Box>
  );
};

export default WriteComment;
