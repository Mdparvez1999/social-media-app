import { useState } from "react";
import { toast } from "react-toastify";

const useDeclineFollowRequest = () => {
  const [declineRequestLoading, setDeclineRequestLoading] =
    useState<boolean>(false);

  const declineFollowRequest = async (id: string | undefined) => {
    if (!id) return;
    setDeclineRequestLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/users/decline-request/${id}`,
        {
          method: "DELETE",
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
      setDeclineRequestLoading(false);
    }
  };

  return { declineRequestLoading, declineFollowRequest };
};

export default useDeclineFollowRequest;
