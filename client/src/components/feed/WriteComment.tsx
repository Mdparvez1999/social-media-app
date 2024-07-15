import { Box, Button, Input } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { toast } from "react-toastify";
import { addCommentToFeedPost } from "../../redux-store/features/feed/feedSlice";

const WriteComment = () => {
  const dispatch = useAppDispatch();

  const post = useAppSelector((state) => state.feed.singlePost);

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
      const response = await fetch(`/api/post/comments/write/${post?.id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const { data } = await response.json();

      dispatch(addCommentToFeedPost(data));
    } catch (error) {
      console.log(error);
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setComment("");
    }
  };

  return (
    <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
      <Input
        width={"80%"}
        placeholder="write a comment"
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
        write
      </Button>
    </Box>
  );
};

export default WriteComment;
