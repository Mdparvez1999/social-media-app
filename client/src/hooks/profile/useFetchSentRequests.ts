import { toast } from "react-toastify";

const useFetchSentRequests = () => {
  const fetchSentRequests = async (id: string | undefined) => {
    if (!id) return;
    try {
      const response = await fetch(`/api/users/sent-requests/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "fail" || data.status === "error") {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return { fetchSentRequests };
};

export default useFetchSentRequests;
