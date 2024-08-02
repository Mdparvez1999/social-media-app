import { Box, Heading, useDisclosure } from "@chakra-ui/react";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
// import { formatCreatedAtTime } from "../../utils/formatTimes.utils";
import { FaRegComment } from "react-icons/fa";
import PostCommentsInMobile from "./PostCommentsInMobile";

interface File {
  id: string;
  fileName: string;
  type: string;
}

interface PostLikes {
  id: string;
  isLiked: boolean;
  liked_at: Date;
  post: string;
  user: {
    id: string;
    profilePic: string;
    userName: string;
  };
}
interface Post {
  id: string;
  caption: string;
  commentCount: number;
  likeCount: number;
  files: File[];
  postlikes: PostLikes[];
  user: {
    id: string;
    profilePic: string;
    userName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
const LikeAndComments = ({ post }: { post: Post }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Box display={"flex"} alignItems={"center"} gap={"10px"}>
          <CiHeart size={"2rem"} cursor={"pointer"} />
          <FaRegComment size={"1.5rem"} cursor={"pointer"} onClick={onOpen} />
          <LuSend size={"1.5rem"} />
        </Box>
        <Box>
          <CiBookmark size={"1.5rem"} />
        </Box>
      </Box>
      <Box pt={"5px"} display={"flex"} flexDirection={"column"} gap={"5px"}>
        {post?.likeCount === 0 ? (
          <Heading fontSize={"1.1rem"}>Be the first to like</Heading>
        ) : (
          <Heading fontSize={"1.1rem"}>{post?.likeCount}</Heading>
        )}
      </Box>
      <PostCommentsInMobile isOpen={isOpen} onClose={onClose} post={post} />
    </Box>
  );
};

export default LikeAndComments;
