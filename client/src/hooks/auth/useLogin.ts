import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface loginDataType {
  email: string;
  password: string;
}

const useLogin = () => {
  const { setCurrentUser } = useAuthContext();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = async (logindata: loginDataType) => {
    const isValidData = loginDataValidation(logindata);

    if (!isValidData) return;

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(logindata),
      });

      const data = await response.json();

      if (data.status === "fail") {
        throw new Error(data.message);
      }

      localStorage.setItem("userData", JSON.stringify(data));

      setCurrentUser(data);

      toast.success(data.message);

      navigate("/app/home");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return { loading, loginUser };
};

const loginDataValidation = (logindata: loginDataType) => {
  const { email, password } = logindata;

  if (!email || !password) {
    toast.error("Please fill all the fields");
    return false;
  }

  if (!email.includes("@") || !email.includes(".")) {
    toast.error("Please enter a valid email");
    return false;
  }

  if (password.length < 6 || password.length > 30) {
    toast.error("Password must be between 6 and 30 characters");
    return false;
  }

  return true;
};

export default useLogin;
