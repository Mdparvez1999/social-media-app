import { toast } from "react-toastify";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const { setCurrentUser } = useAuthContext();

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

      localStorage.removeItem("userData");

      setCurrentUser(null);

      toast.success(data.message, {
        position: "top-center",
      });

      navigate("/login");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };
  return { logoutUser };
};

export default useLogout;
