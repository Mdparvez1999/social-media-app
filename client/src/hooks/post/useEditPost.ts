import { toast } from "react-toastify";

const useEditPost = () => {
  const editPost = async (id: string | undefined, caption: string) => {
    try {
      const response = await fetch(`/api/users/post/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption,
        }),
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

  return { editPost };
};

export default useEditPost;
