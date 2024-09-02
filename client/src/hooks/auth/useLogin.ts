import { useState } from "react";
import { toast } from "react-toastify";

interface loginDataType {
  email: string;
  password: string;
}

const useLogin = () => {
  const [loading, setLoading] = useState(false);

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

      if (data.status === "fail" || data.status === "error") {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
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
