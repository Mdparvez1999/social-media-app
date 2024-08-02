import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";
import Content from "./Content";
import LikeCommentPost from "./LikeCommentPost";
import WriteComment from "./WriteComment";
import { setFeedSinglePost } from "../../redux-store/features/feed/feedSlice";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const feed = useAppSelector((state) => state.feed.posts);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const handleViewUserProfile = async (userId: string) => {
    setLoading(true);
    try {
      const isMobile = window.matchMedia("(max-width:768px)").matches;
      if (isMobile) {
        navigate(`/app/selectedUserProfile/${userId}`);
      } else {
        navigate(`/app/usersprofile/${userId}`);
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box padding={"10px 20px"} borderRadius={"10px"}>
        {feed?.map((post) => (
          <React.Fragment key={post.id}>
            <Card
              maxWidth={"md"}
              minHeight={"100px"}
              border={"1px solid #f2f2f2"}
              boxShadow={"2px 4px 8px #ccc"}
              padding={"18px"}
              mb={"20px"}
              onClick={() => dispatch(setFeedSinglePost(post))}
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
                    src={
                      post.user.profilePic !== null
                        ? `http://localhost:8000/uploads/profilePic/${post.user.profilePic}`
                        : undefined
                    }
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
              <CardBody border={"1px solid #f2f2f2"} my={"10px"} p={0}>
                <Box>
                  <Content file={post.files} />
                </Box>
              </CardBody>
              <CardFooter
                my={"4px"}
                p={0}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
              >
                <Box>
                  <LikeCommentPost />
                </Box>
                <Box pl={"5px"}>
                  {post.likeCount > 0 ? (
                    <Text fontWeight={"bold"} fontSize={"1.2rem"}>
                      {post.likeCount}
                    </Text>
                  ) : (
                    <Text my={"5px"} fontSize={"1rem"} fontWeight={"500"}>
                      be the first to like
                    </Text>
                  )}
                </Box>
                <Box pl={"5px"}>
                  {post.caption !== "" ? (
                    <Box display={"flex"} alignItems={"center"} gap={"8px"}>
                      <Text fontSize={"1.2rem"} fontWeight={"bold"}>
                        {post.user.userName}
                      </Text>
                      <Text fontSize={"1.2rem"}>{post.caption}</Text>
                    </Box>
                  ) : null}
                </Box>
                <Box mt={"8px"} pl={"5px"}>
                  <WriteComment />
                </Box>
              </CardFooter>
            </Card>
          </React.Fragment>
        ))}
      </Box>
      {loading && <Spinner />}
    </>
  );
};

export default Feed;
