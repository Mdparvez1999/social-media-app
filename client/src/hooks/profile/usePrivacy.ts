import { toast } from "react-toastify";
import { updatePrivacy } from "../../redux-store/features/profile/profileSlice";
import { useAppDispatch } from "../hooks";

const usePrivacy = () => {
  const dispatch = useAppDispatch();
  const makePrivate = async () => {
    try {
      const response = await fetch("/api/user/profile/private", {
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
