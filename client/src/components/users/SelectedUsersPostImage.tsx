import { Box, Image } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";
import { Carousel } from "react-responsive-carousel";

const SelectedUsersPostImage = () => {
  const selectedUsersPost = useAppSelector(
    (state) => state.users.selectedUsersSinglePost
  );

  const images = selectedUsersPost?.files;

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

export default SelectedUsersPostImage;
