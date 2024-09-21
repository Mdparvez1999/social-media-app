import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spinner,
} from "@chakra-ui/react";
import { useAppSelector } from "../hooks/hooks";

const FeedSkeleton = () => {
  const feed = useAppSelector((state) => state.feed.posts);

  return (
    <>
      <Box padding={"10px 20px"} borderRadius={"10px"}>
        {feed?.map((post) => (
          <Card
            key={post.id}
            width={"350px"}
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
              <Box display={"flex"} gap={"10px"} cursor={"pointer"}>
                <SkeletonCircle size="10" />
                <Box>
                  <Skeleton height="20px" width="120px" mt={"5px"} />
                  <Skeleton height="15px" width="60px" mt={"5px"} />
                </Box>
              </Box>
              <Button>
                <Skeleton height="20px" width="20px" />
              </Button>
            </CardHeader>
            <CardBody border={"1px solid #f2f2f2"} my={"10px"} p={0}>
              <Skeleton height="200px" />
            </CardBody>
            <CardFooter
              my={"4px"}
              p={0}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              <Box display={"flex"} alignItems={"center"} gap={"6px"}>
                <Skeleton height="20px" width="100px" />
              </Box>
              <Box pl={"5px"}>
                <SkeletonText
                  mt="4"
                  noOfLines={2}
                  spacing="4"
                  skeletonHeight="20px"
                />
              </Box>
              <Box mt={"8px"} pl={"5px"}>
                <Skeleton height="40px" />
              </Box>
            </CardFooter>
          </Card>
        ))}
      </Box>
      {feed?.length === 0 && <Spinner />}
    </>
  );
};

export default FeedSkeleton;
