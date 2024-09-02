const useUnlikePost = () => {
  const unlikePost = async (postId: string | undefined) => {
    if (!postId) return;

    try {
      const response = await fetch(`/api/users/post/unlike/${postId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      return data;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  };

  return { unlikePost };
};

export default useUnlikePost;
