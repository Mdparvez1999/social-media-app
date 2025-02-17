import { toast } from "react-toastify";

interface PropsType {
  postId: string | null;
  userId: string | undefined;
}
const useFetchSelectedusersPost = () => {
  const fetchSelectedUsersPost = async ({ postId, userId }: PropsType) => {
    if (!postId && !userId) return;

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/users/post/user/${postId}?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === "fail" || data.status === "error") {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };
  return { fetchSelectedUsersPost };
};

export default useFetchSelectedusersPost;
