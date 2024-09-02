import { Box, Flex, IconButton, Image } from "@chakra-ui/react";
import { useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Property } from "csstype";

interface CustomCarouselProps {
  images: string[] | undefined;
  height?: string;
  width?: string;
  objectFit?: Property.ObjectFit;
}

const CustomCarouselForMobile = ({
  images,
  height,
  width,
  objectFit = "cover",
}: CustomCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images) return null;

  const handlePrevImage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box
      position={"relative"}
      width={"100%"}
      maxWidth={width}
      height={height}
      mx={"auto"}
      overflow={"hidden"}
    >
      <Image
        src={images[currentIndex]}
        crossOrigin="anonymous"
        width={"100%"}
        height={"100%"}
        objectFit={objectFit}
        objectPosition={"center"}
        alt={`image ${currentIndex + 1}`}
        borderRadius={"md"}
        transition="opacity 0.3s ease-in-out"
      />

      {images.length > 1 && (
        <Flex
          position={"absolute"}
          top={"50%"}
          width={"100%"}
          justifyContent={"space-between"}
          transform={"translateY(-50%)"}
          px={2}
        >
          <IconButton
            aria-label="previous image"
            icon={<BiChevronLeft size={"1rem"} />}
            onClick={handlePrevImage}
            bg={"rgba(0,0,0,0.5)"}
            _hover={{ bg: "rgba(0,0,0,0.8)" }}
            color={"white"}
          />
          <IconButton
            aria-label="next image"
            icon={<BiChevronRight size={"1rem"} />}
            onClick={handleNextImage}
            bg={"rgba(0,0,0,0.5)"}
            _hover={{ bg: "rgba(0,0,0,0.8)" }}
            color={"white"}
          />
        </Flex>
      )}
    </Box>
  );
};

export default CustomCarouselForMobile;
