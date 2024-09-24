import { toast } from "react-toastify";

const useDeletePost = () => {
  const deletePost = async (id: string | undefined) => {
    if (!id) return;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/users/post/delete/${id}`,
        {
          method: "DELETE",
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

      toast.success(data.message);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return { deletePost };
};

export default useDeletePost;
