import { Box, keyframes } from "@chakra-ui/react";
import { useCallback, useState } from "react";

interface CustomLikeButtonProps {
  isLiked: boolean;
  onClick: () => void;
}

const scaleUp = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
`;

const CustomLikeButton = ({ isLiked, onClick }: CustomLikeButtonProps) => {
  const [animate, setAnimate] = useState(false);

  const handleClick = useCallback(() => {
    setAnimate(true);
    onClick();
  }, [onClick]);

  const handleAnimationEnd = () => {
    setAnimate(false);
  };

  return (
    <Box
      as="span"
      display="inline-block"
      width="2rem"
      height="1.8rem"
      cursor="pointer"
      onClick={handleClick}
      animation={animate ? `${scaleUp} 0.3s ease` : undefined}
      onAnimationEnd={handleAnimationEnd}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={isLiked ? "red" : "white"}
          stroke={isLiked ? "red" : "black"}
          strokeWidth="2"
        />
      </svg>
    </Box>
  );
};

export default CustomLikeButton;
