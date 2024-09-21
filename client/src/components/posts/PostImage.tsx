import { Box } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";
import { PostState } from "../../redux-store/features/post/postsSlice";
import CustomCarousel from "../layouts/general/CustomCarousel";
import { useEffect, useState } from "react";
import PostImageSkeleton from "../../skeletons/PostImageSkeleton";

const CurrentPostImage = () => {
  const post = useAppSelector(
    (state) => state.posts.singlePost
  ) as PostState | null;

  const images = post?.files;

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (images) setLoading(false);
  }, [images]);

  return loading ? (
    <PostImageSkeleton />
  ) : (
    <Box w={"100%"} h={"100%"}>
      <CustomCarousel
        images={images?.map((image) => image)}
        width={"100%"}
        height={"100%"}
        objectFit={"contain"}
      />
    </Box>
  );
};

export default CurrentPostImage;
