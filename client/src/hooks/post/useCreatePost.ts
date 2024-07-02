import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface useCreatePostReturnType {
  loading: boolean;
  createPost: (createPostData: FormData) => Promise<void>;
}

const useCreatePost = (): useCreatePostReturnType => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createPost = async (createPostData: FormData) => {
    createPostData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      setLoading(true);

      const response = await fetch("/api/users/post/create", {
        method: "POST",
        credentials: "include",
        body: createPostData,
      });

      const data = await response.json();

      if (data.status === "error" || data.status === "fail") {
        throw new Error(data.message);
      }

      toast.success(data.message);

      navigate("/app/profile");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, createPost };
};

export default useCreatePost;
