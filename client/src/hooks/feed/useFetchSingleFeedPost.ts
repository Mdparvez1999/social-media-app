import { toast } from "react-toastify";

const useFetchSingleFeedPost = () => {
  const fetchFeedPost = async (id: string | null) => {
    if (!id) return;

    try {
      const response = await fetch(`/api/users/post/feed-post/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "fail" || data.status === "error") {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return { fetchFeedPost };
};

export default useFetchSingleFeedPost;
