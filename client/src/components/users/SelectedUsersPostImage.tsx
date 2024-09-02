import { Box } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";
import CustomCarousel from "../layouts/general/CustomCarousel";
import { useEffect, useState } from "react";
import PostImageSkeleton from "../../skeletons/PostImageSkeleton";

const SelectedUsersPostImage = () => {
  const selectedUsersPost = useAppSelector(
    (state) => state.users.selectedUsersSinglePost
  );

  const images = selectedUsersPost?.files;

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (images) setLoading(false);
  }, [images]);

  return loading ? (
    <PostImageSkeleton />
  ) : (
    <>
      <Box w={"100%"} h={"100%"}>
        <CustomCarousel
          images={images?.map(
            (image) =>
              `http://localhost:8000/uploads/postFiles/${image.fileName}`
          )}
          width={"100%"}
          height={"100%"}
          objectFit={"contain"}
        />
      </Box>
    </>
  );
};

export default SelectedUsersPostImage;
