import { Box, Button, Input } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/hooks";
import { addComment } from "../../redux-store/features/comments/commentsSlice";

interface propsType {
  postId: string | undefined;
}
const AddComment = ({ postId }: propsType) => {
  const [comment, setComment] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

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

      const data = await response.json();
      console.log(data);

      dispatch(addComment(data));
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
        ml={"10px"}
        placeholder="write a comment"
        name="comment"
        borderRadius={"10px"}
        onChange={handleChange}
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

export default AddComment;
