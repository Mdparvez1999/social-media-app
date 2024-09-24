import { toast } from "react-toastify";

const useReadNotification = () => {
  const readNotifications = async (notificationId: string | undefined) => {
    if (!notificationId) return;

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/notification/read/${notificationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to read notification");

      const { data } = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errMsg);
    }
  };

  return { readNotifications };
};

export default useReadNotification;
