import { Box } from "@chakra-ui/react";
import CustomCarousel from "../layouts/general/CustomCarousel";

interface ContentProps {
  files: string[];
}

const Content = ({ files }: ContentProps) => {
  const imageFiles = files?.filter((file: string) =>
    ["image", "svg", "png", "jpeg", "jpg", "webp"].some((ext) =>
      file.includes(ext)
    )
  );

  if (!imageFiles) return;

  const videoFiles = files?.filter((file: string) => file.includes("mp4"));

  if (!videoFiles) return;

  return (
    <>
      <Box height={"230px"} width={"100%"} overflow={"hidden"}>
        {imageFiles && imageFiles.length > 0 && (
          <CustomCarousel
            images={imageFiles.map((file: string) => file)}
            height="230px"
            width="100%"
            objectFit="contain"
          />
        )}
        {videoFiles?.map((file: string) => (
          <video
            key={file}
            src={file}
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
