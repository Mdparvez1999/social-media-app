import { useState } from "react";
import { toast } from "react-toastify";

const useFetchFeedComments = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const fetchFeedComments = async (postId: string | undefined) => {
    if (!postId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/post/comments/get-all/${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      return data;
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { fetchFeedComments, loading };
};

export default useFetchFeedComments;
