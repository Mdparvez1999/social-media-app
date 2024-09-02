import { useState } from "react";
import { toast } from "react-toastify";

const useDeclineFollowRequest = () => {
  const [declineRequestLoading, setDeclineRequestLoading] =
    useState<boolean>(false);

  const declineFollowRequest = async (id: string | undefined) => {
    if (!id) return;
    setDeclineRequestLoading(true);
    try {
      const response = await fetch(`/api/users/decline-request/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

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
