import { Box, Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";

interface FileType {
  id: string | null;
  fileName: string;
  type: string;
}

interface ContentPropType {
  file: FileType[] | null;
}

const Content = ({ file }: ContentPropType) => {
  const imageFiles = file?.filter(
    (file) =>
      file.type === "image" ||
      file.type === "svg" ||
      file.type === "png" ||
      file.type === "jpeg" ||
      file.type === "jpg" ||
      file.type === "webp"
  );

  const videoFiles = file?.filter((file) => file.type === "video");

  return (
    <>
      <Box height={"230px"} width={"100%"} overflow={"hidden"}>
        {imageFiles && imageFiles.length > 0 && (
          <Carousel dynamicHeight showThumbs={false}>
            {imageFiles.map((file) => (
              <Image
                key={file.id}
                width={"100%"}
                height={"100%"}
                src={
                  file.fileName
                    ? `http://localhost:8000/uploads/postFiles/${file.fileName}`
                    : undefined
                }
                alt="user_post"
                crossOrigin="anonymous"
                objectFit={"cover"}
                p={0}
              />
            ))}
          </Carousel>
        )}
        {videoFiles &&
          videoFiles.length > 0 &&
          videoFiles.map((file) => (
            <video
              src={`http://localhost:8000/uploads/postFiles/${file.fileName}`}
              width={"100%"}
              height={"100%"}
              controls
            />
          ))}
      </Box>
    </>
  );
};

export default Content;
