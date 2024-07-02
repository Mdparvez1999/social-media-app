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
      width={"390px"}
      margin={"50px auto"}
      borderRadius={"10px"}
      boxShadow={"4px 4px 6px #ccc"}
    >
      <Box as="h1" textAlign={"center"} mt={"14px"} fontSize={"1.2rem"}>
        login
      </Box>
      <form className="signup-form">
        <Box padding={"10px"} margin={"2px 20px 6px 20px"}>
          <Text>Email</Text>
          <Input borderRadius="50px" name="email" onChange={handleChange} />
        </Box>
        <Box padding={"10px"} margin={"2px 20px 6px 20px"}>
          <Text>Password</Text>
          <Input
            type="password"
            borderRadius="50px"
            name="password"
            onChange={handleChange}
          />
          <Box as="span" display={"block"} mt={"6px"}>
            <ChakraLink
              as={Link}
              to="/forgotpassword"
              _hover={{ color: "blue", textDecoration: "underline" }}
            >
              Forgot password?
            </ChakraLink>
          </Box>
        </Box>
        <Box padding={"10px"} margin={"2px 20px 6px 20px"}>
          <Button
            width="100%"
            borderRadius="30px"
            fontSize="1.03rem"
            onClick={handleLogin}
            isLoading={loading}
          >
            login
          </Button>
        </Box>
      </form>
      <Box textAlign={"center"}>
        <Box as="span">
          don't have an account?{" "}
          <ChakraLink
            as={Link}
            to="/signup"
            _hover={{ color: "blue", textDecoration: "underline" }}
          >
            register
          </ChakraLink>
        </Box>
      </Box>
      <Center margin="10px 25px 6px 25px">
        <Divider />
        <Text px="2" color={"gray.800"}>
          or
        </Text>
        <Divider />
      </Center>
      <Box padding={"10px"} margin={"8px 20px 16px 20px"}>
        <Button
          leftIcon={<FcGoogle />}
          width="100%"
          borderRadius="50px"
          fontSize="1.02rem"
        >
          Continue with Google
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
