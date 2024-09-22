import { toast } from "react-toastify";

const useFetchPutObjectPresignedUrls = () => {
  const fetchPutObjectPresignedUrls = async (
    fileData: { name: string; type: string }[]
  ) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/aws-s3/create-put-object-url`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ files: fileData }),
        }
      );

      const presignedUrlData = await response.json();

      if (
        presignedUrlData.status === "error" ||
        presignedUrlData.status === "fail"
      ) {
        throw new Error(presignedUrlData.message);
      }

      return presignedUrlData.data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return { fetchPutObjectPresignedUrls };
};

export default useFetchPutObjectPresignedUrls;
