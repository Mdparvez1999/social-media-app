import {
  Button,
  Input,
  Text,
  Box,
  Divider,
  Center,
  Link as ChakraLink,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import useLogin from "../../../hooks/auth/useLogin";
import { useAppDispatch } from "../../../hooks/hooks";
import { setCurrentUser } from "../../../redux-store/features/auth/authSlice";
import ActivateAccount from "../../../components/profile/ActivateAccount";

interface LoginState {
  email: string;
  password: string;
}

const Login = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [login, setLogin] = useState<LoginState>({
    email: "",
    password: "",
  });
  const [userId, setUserId] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin((prevstate) => ({ ...prevstate, [name]: value }));
  };

  const { loading, loginUser } = useLogin();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    try {
      const userData = await loginUser(login);

      if (!userData?.user) return;

      if (!userData.user?.isActive) {
        setUserId(userData.user.id);
        onOpen();
        return;
      }

      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;

      dispatch(
        setCurrentUser({
          user: userData.user,
          token: userData.token,
          expirationTime,
        })
      );
      navigate("/app/home");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Box
        borderWidth={"1px"}
        borderColor={"#f2f2f2"}
        width={{ xs: "90%", md: "390px" }}
        margin={{ xs: "90px auto", md: "50px auto" }}
        borderRadius="10px"
        boxShadow="4px 4px 6px #ccc"
        p={{ sm: "0", md: "10px" }}
      >
        <Text
          as="h1"
          textAlign="center"
          mt="14px"
          fontSize={{ sm: "1rem", md: "1.2rem" }}
        >
          Login
        </Text>
        <form>
          <Box padding="10px" margin="2px 20px 6px 20px">
            <Text>Email</Text>
            <Input
              borderRadius="50px"
              name="email"
              onChange={handleChange}
              fontSize={{ base: "0.9rem", md: "1rem" }}
              autoFocus
              type="email"
            />
          </Box>
          <Box padding="10px" margin="2px 20px 6px 20px">
            <Text>Password</Text>
            <Input
              borderRadius="50px"
              name="password"
              type="password"
              onChange={handleChange}
              fontSize={{ base: "0.9rem", md: "1rem" }}
            />
            <Box as="span" display="block" mt="6px">
              <ChakraLink
                as={Link}
                to="/forgotpassword"
                _hover={{ color: "blue", textDecoration: "underline" }}
              >
                Forgot password?
              </ChakraLink>
            </Box>
          </Box>
          <Box padding="10px" margin="2px 20px 6px 20px">
            <Button
              width="100%"
              borderRadius="30px"
              fontSize={{ base: "0.9rem", md: "1.03rem" }}
              isLoading={loading}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
        </form>
        <Box textAlign="center" mt="4">
          <Box as="span">
            Don't have an account?{" "}
            <ChakraLink
              as={Link}
              to="/signup"
              _hover={{ color: "blue", textDecoration: "underline" }}
            >
              Register
            </ChakraLink>
          </Box>
        </Box>
        <Center margin="10px 25px 6px 25px">
          <Divider />
          <Text px="10px" color="gray.800">
            or
          </Text>
          <Divider />
        </Center>
        <Box padding="10px" margin="8px 20px 16px 20px">
          <Button
            leftIcon={<FcGoogle />}
            width="100%"
            borderRadius="50px"
            fontSize={{ base: "0.9rem", md: "1.02rem" }}
          >
            Continue with Google
          </Button>
        </Box>
      </Box>
      <ActivateAccount onClose={onClose} isOpen={isOpen} userId={userId} />
    </>
  );
};

export default Login;
