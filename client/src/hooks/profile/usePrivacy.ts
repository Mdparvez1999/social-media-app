import { toast } from "react-toastify";
import { updatePrivacy } from "../../redux-store/features/profile/profileSlice";
import { useAppDispatch } from "../hooks";

const usePrivacy = () => {
  const dispatch = useAppDispatch();
  const makePrivate = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/user/profile/private`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "fail" || data.status === "error") {
        throw new Error(data.message);
      }

      dispatch(updatePrivacy(data.isPrivate));
      toast.success(data.message);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const makePublic = async () => {
    try {
      const response = await fetch("/api/user/profile/public", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "fail" || data.status === "error") {
        throw new Error(data.message);
      }

      dispatch(updatePrivacy(data.isPrivate));
      toast.success(data.message);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return {
    makePrivate,
    makePublic,
  };
};

export default usePrivacy;
