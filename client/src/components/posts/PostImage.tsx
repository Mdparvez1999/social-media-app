import { Box, Image } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";
import { PostState } from "../../redux-store/features/post/postsSlice";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CurrentPostImage = () => {
  const post = useAppSelector(
    (state) => state.posts.singlePost
  ) as PostState | null;

  const images = post?.files;

  return (
    <>
      <Box w={"100%"} h={"100%"}>
        <Carousel
          showThumbs={false}
          showStatus={false}
          autoPlay
          infiniteLoop
          useKeyboardArrows
        >
          {images?.map((image) => {
            return (
              <Image
                key={image.fileName}
                crossOrigin="anonymous"
                w={"100%"}
                h={"100%"}
                objectFit={"cover"}
                src={`http://localhost:8000/uploads/postFiles/${image.fileName}`}
              />
            );
          })}
        </Carousel>
      </Box>
    </>
  );
};

export default CurrentPostImage;
