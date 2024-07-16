import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface useSignupProps {
  userName: string;
  email: string;
  password: string;
}
interface SignupResponse {
  error?: string;
  message?: string;
  userData?: unknown;
}

interface useSignupReturnType {
  loading: boolean;
  signUp: (signupData: useSignupProps) => Promise<void>;
}
const useSignup = (): useSignupReturnType => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signUp = async (signupData: useSignupProps) => {
    const isValid = signUpValidation(signupData);

    if (!isValid) return;

    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(signupData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: SignupResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("userData", JSON.stringify(data));

      toast.success(data.message);
      navigate("/app/home");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { loading, signUp };
};

const signUpValidation = (signupData: useSignupProps): boolean => {
  const { userName, email, password } = signupData;
  if (!userName || !email || !password) {
    toast.error("Please fill all the fields");
    return false;
  }

  if (userName.length < 3 || userName.length > 30) {
    toast.error("Username must be between 3 and 30 characters");
    return false;
  }

  if (!email.includes("@") || !email.includes(".")) {
    toast.error("Please enter a valid email address");
    return false;
  }

  if (password.length < 6 || password.length > 30) {
    toast.error("Password must be between 6 and 30 characters");
    return false;
  }

  return true;
};

export default useSignup;
