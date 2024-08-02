import {
  Button,
  Input,
  Text,
  Box,
  Divider,
  Center,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import useLogin from "../../../hooks/auth/useLogin";

interface loginState {
  email: string;
  password: string;
}

const Login = () => {
  const [login, setLogin] = useState<loginState>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const { loading, loginUser } = useLogin();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(login);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return (
    <Box
      border="1px solid #f2f2f2"
      width={{ sm: "350px", md: "390px" }}
      margin={{ sm: "50px auto" }}
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
      <form className="signup-form" onSubmit={handleLogin}>
        <Box padding="10px" margin="2px 20px 6px 20px">
          <Text>Email</Text>
          <Input
            borderRadius="50px"
            name="email"
            onChange={handleChange}
            fontSize={{ base: "0.9rem", md: "1rem" }}
          />
        </Box>
        <Box padding="10px" margin="2px 20px 6px 20px">
          <Text>Password</Text>
          <Input
            type="password"
            borderRadius="50px"
            name="password"
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
            onClick={handleLogin}
            isLoading={loading}
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
  );
};

export default Login;
