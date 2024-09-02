import { Box } from "@chakra-ui/react";
import CustomCarousel from "../layouts/general/CustomCarousel";

interface FileType {
  id: string | null;
  fileName: string;
  type: string;
}

interface ContentPropType {
  file: FileType[] | null;
}

const Content = ({ file }: ContentPropType) => {
  const imageFiles = file?.filter(({ type }) =>
    ["image", "svg", "png", "jpeg", "jpg", "webp"].includes(type)
  );

  if (!imageFiles) return;

  const videoFiles = file?.filter((file) => file.type === "video");

  if (!videoFiles) return;

  return (
    <>
      <Box height={"230px"} width={"100%"} overflow={"hidden"}>
        {imageFiles && imageFiles.length > 0 && (
          <CustomCarousel
            images={imageFiles.map(
              ({ fileName }) =>
                `http://localhost:8000/uploads/postFiles/${fileName}`
            )}
            height="230px"
            width="100%"
            objectFit="contain"
          />
        )}
        {videoFiles?.map((file) => (
          <video
            key={file.id}
            src={
              file.fileName
                ? `http://localhost:8000/uploads/postFiles/${file.fileName}`
                : undefined
            }
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
