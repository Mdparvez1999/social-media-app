const useFetchGetObjectProfilePicUrl = () => {
  const fetchGetObjectProfilePicUrl = async (key: string) => {
    if (!key) return;

    const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_BASE_URL;
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_API_BASE_URL
      }/api/aws-s3/create-get-object-url-profile-pic`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
