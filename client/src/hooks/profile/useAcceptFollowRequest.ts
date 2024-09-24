import { useState } from "react";
import { toast } from "react-toastify";

const useAcceptFollowRequest = () => {
  const [acceptRequestLoading, setAcceptRequestLoading] =
    useState<boolean>(false);

  const acceptFollowRequest = async (id: string | undefined) => {
    if (!id) return;
    setAcceptRequestLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/users/accept-request/${id}`,
        {
          method: "POST",
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

      return data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setAcceptRequestLoading(false);
    }
  };

  return { acceptRequestLoading, acceptFollowRequest };
};

export default useAcceptFollowRequest;
