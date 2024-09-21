import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";
import Content from "./Content";
import WriteComment from "./WriteComment";
import {
  FeedState,
  setFeedSinglePost,
} from "../../redux-store/features/feed/feedSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useFetchPostLikes from "../../hooks/post/useFetchPostLikes";
import LikeAndCommentsFeedPost from "./LikeAndCommentsFeedPost";
import FeedSkeleton from "../../skeletons/FeedSkeleton";

const Feed = () => {
  const feed = useAppSelector((state) => state.feed.posts);
  const singlePost = useAppSelector((state) => state.feed.singlePost);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (feed) {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [feed, singlePost]);

  const handleViewUserProfile = (userId: string) => {
    navigate(`/app/usersprofile/${userId}`);
  };

  const { fetchPostLikes } = useFetchPostLikes();

  const handlePostClick = async (post: FeedState) => {
    if (singlePost?.id !== post.id) {
      dispatch(setFeedSinglePost(post));
    }
    try {
      const data = await fetchPostLikes(post.id);
      dispatch(setFeedSinglePost(data.data));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return loading ? (
    <FeedSkeleton />
  ) : (
    <Box padding={"10px 20px"} borderRadius={"10px"}>
      {feed.length === 0 ? (
        <Text
          fontSize={{ xs: "1.1rem", md: "1.3rem" }}
          textAlign={"center"}
          mt={"20px"}
        >
          Welcome! There are no posts in your feed yet. Start following users to
          see their posts here.
        </Text>
      ) : (
        feed.map((post) => (
          <Card
            key={post.id}
            maxWidth={"sm"}
            minHeight={"100px"}
            border={"1px solid #f2f2f2"}
            boxShadow={"2px 4px 8px #ccc"}
            padding={"18px"}
            mb={"20px"}
          >
            <CardHeader
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              height={"50px"}
              p={0}
            >
              <Box
                display={"flex"}
                gap={"10px"}
                cursor={"pointer"}
                onClick={() => handleViewUserProfile(post.user.id)}
              >
                <Avatar
                  src={post.user.profilePic ? post.user.profilePic : undefined}
                  name={post.user.userName}
                  crossOrigin="anonymous"
                />
                <Heading fontSize={"1.3rem"} mt={"5px"}>
                  {post.user.userName} {"."}
                </Heading>
                <Text fontSize={"1rem"} mt={"7px"}>
                  {formatCreatedAtTime(post.createdAt)}
                </Text>
              </Box>
              <Button>
                <PiDotsThreeOutlineVertical />
              </Button>
            </CardHeader>
            <CardBody my={"4px"} p={0}>
              <Box>
                <Content files={post.files} />
              </Box>
            </CardBody>
            <CardFooter
              my={"2px"}
              p={0}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              <Box display={"flex"} alignItems={"center"} gap={"6px"}>
                <Box onClick={() => handlePostClick(post)}>
                  <LikeAndCommentsFeedPost postId={post.id} />
                </Box>
              </Box>
              <Box pl={"5px"}>
                {post.caption && (
                  <Box display={"flex"} alignItems={"center"} gap={"8px"}>
                    <Text fontSize={"1.2rem"} fontWeight={"bold"}>
                      {post.user.userName}
                    </Text>
                    <Text fontSize={"1.2rem"}>{post.caption}</Text>
                  </Box>
                )}
              </Box>
              <Box mt={"8px"} pl={"5px"}>
                <WriteComment postId={post.id} />
              </Box>
            </CardFooter>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Feed;
