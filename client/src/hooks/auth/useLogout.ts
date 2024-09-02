import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { logoutCurrentUser } from "../../redux-store/features/auth/authSlice";
import { clearFeed } from "../../redux-store/features/feed/feedSlice";

const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      dispatch(logoutCurrentUser());
      dispatch(clearFeed());

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };
  return { logoutUser };
};

export default useLogout;
