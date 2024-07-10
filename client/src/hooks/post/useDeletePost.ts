import { toast } from "react-toastify";

const useDeletePost = () => {
  const deletePost = async (id: string | undefined) => {
    try {
      const response = await fetch(`/api/users/post/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

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
