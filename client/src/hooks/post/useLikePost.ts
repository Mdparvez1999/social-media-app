import { toast } from "react-toastify";

const useLikePostHook = () => {
  const likePost = async (postId: string | undefined) => {
    if (!postId) return;

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/users/post/like/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      return data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return { likePost };
};

export default useLikePostHook;
