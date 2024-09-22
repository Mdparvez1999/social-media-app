import { useState } from "react";
import { toast } from "react-toastify";
import useFetchPutObjectPresignedUrls from "./useFetchPutObjectPresignedUrls";
import { sanitizeFileName } from "../../utils/sanitizeFileName";

interface useCreatePostReturnType {
  loading: boolean;
  createPost: (createPostData: FormData) => Promise<void>;
}

const useCreatePost = (): useCreatePostReturnType => {
  const [loading, setLoading] = useState<boolean>(false);

  const { fetchPutObjectPresignedUrls } = useFetchPutObjectPresignedUrls();

  const createPost = async (createPostData: FormData) => {
    setLoading(true);

    try {
      const files = createPostData.getAll("files");

      const fileData = files
        .map((file) => {
          if (file instanceof File) {
            const sanitizedFileName = sanitizeFileName(file.name);
            return { name: sanitizedFileName, type: file.type };
          }
          return undefined;
        })
        .filter(
          (data): data is { name: string; type: string } => data !== undefined
        );

      // Step 1: Get presigned URLs
      const urlsData = await fetchPutObjectPresignedUrls(fileData);

      // Step 2: Upload each file to the corresponding presigned URL
      const uploadResults = await Promise.all(
        urlsData.map(
          async (
            urlData: { key: string; presignedUrl: string },
            index: number
          ) => {
            const file = files[index];
            if (file instanceof File) {
              const uploadResponse = await fetch(urlData.presignedUrl, {
                method: "PUT",
                headers: {
                  "Content-Type": file.type,
                },
                body: file,
              });

              if (!uploadResponse.ok) {
                throw new Error(`Failed to upload file: ${file.name}`);
              }

              return urlData.key;
            }
          }
        )
      );

      const createPostBody = {
        caption: createPostData.get("caption"),
        files: uploadResults,
      };

      const createPostResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/users/post/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createPostBody),
        }
      );

      const createPostResponseData = await createPostResponse.json();

      if (
        createPostResponseData.status === "fail" ||
        createPostResponseData.status === "error"
      )
        throw new Error(createPostResponseData.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, createPost };
};

export default useCreatePost;
