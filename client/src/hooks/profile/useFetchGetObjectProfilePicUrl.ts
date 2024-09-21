const useFetchGetObjectProfilePicUrl = () => {
  const fetchGetObjectProfilePicUrl = async (key: string) => {
    if (!key) return;

    const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_BASE_URL;
    const response = await fetch(
      "/api/aws-s3/create-get-object-url-profile-pic",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      }
    );

    const data = await response.json();

    const profilePicUrl = `${cloudFrontUrl}${new URL(data.data).pathname}`;

    return profilePicUrl;
  };

  return { fetchGetObjectProfilePicUrl };
};

export default useFetchGetObjectProfilePicUrl;
