import { useState } from "react";
import { toast } from "react-toastify";

interface useSignupProps {
  userName: string;
  email: string;
  password: string;
}

interface useSignupReturnType {
  loading: boolean;
  signUp: (signupData: useSignupProps) => Promise<void>;
}
const useSignup = (): useSignupReturnType => {
  const [loading, setLoading] = useState(false);

  const signUp = async (signupData: useSignupProps) => {
    const isValid = signUpValidation(signupData);
    if (!isValid) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          body: JSON.stringify(signupData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      toast.success("Signup successful!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
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

export default useSignup;
