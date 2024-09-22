import { useCallback } from "react";

const useFetchGetObjectUrlForAllProfilePics = () => {
  const fetchGetObjectUrlForAllProfilePics = useCallback(
    async (keys: string[]) => {
      if (!keys) return;

      const cloudFrontUrl: string = import.meta.env.VITE_CLOUDFRONT_BASE_URL;

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/aws-s3/create-get-object-url-all-profile-pics`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(keys),
        }
      );

      const data = await response.json();

      const profilePicUrl: string[] = data.data.map(
        (url: string) => `${cloudFrontUrl}${new URL(url).pathname}`
      );

      return profilePicUrl;
    },
    []
  );

  return { fetchGetObjectUrlForAllProfilePics };
};

export default useFetchGetObjectUrlForAllProfilePics;
