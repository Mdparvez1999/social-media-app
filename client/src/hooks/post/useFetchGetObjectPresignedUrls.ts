import { toast } from "react-toastify";

const useFetchGetObjectPresignedUrls = () => {
  const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_BASE_URL;

  const fetchGetObjectPresignedUrls = async (files: string[]) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/aws-s3/create-get-object-url`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(files),
        }
      );

      const presignedUrlData = await response.json();

      if (
        presignedUrlData.status === "error" ||
        presignedUrlData.status === "fail"
      ) {
        throw new Error(presignedUrlData.message);
      }

      const updatedUrls = presignedUrlData?.data?.map((url: string) => {
        const s3Path = new URL(url).pathname;
        return `${cloudFrontUrl}${s3Path}`;
      });

      return updatedUrls;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return { fetchGetObjectPresignedUrls };
};

export default useFetchGetObjectPresignedUrls;
