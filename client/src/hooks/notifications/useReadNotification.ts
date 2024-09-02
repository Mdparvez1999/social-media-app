import { toast } from "react-toastify";

const useReadNotification = () => {
  const readNotifications = async (notificationId: string | undefined) => {
    if (!notificationId) return;

    try {
      const response = await fetch(`/api/notification/read/${notificationId}`, {
        method: "PUT",
        credentials: "include",
      });

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
