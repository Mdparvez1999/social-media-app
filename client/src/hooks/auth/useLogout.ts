import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { logoutCurrentUser } from "../../redux-store/features/auth/authSlice";

const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      dispatch(logoutCurrentUser());

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };
  return { logoutUser };
};

export default useLogout;
