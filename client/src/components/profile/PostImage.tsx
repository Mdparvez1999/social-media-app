import { Image } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";
import { PostState } from "../../redux-store/features/post/postsSlice";

const CurrentPostImage = () => {
  const post = useAppSelector(
    (state) => state.posts.singlePost
  ) as PostState | null;

  const images = post?.files;

  return (
    <>
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
    </>
  );
};

export default CurrentPostImage;
