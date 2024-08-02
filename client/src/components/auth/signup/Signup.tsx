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
import { toast } from "react-toastify";
import { ChangeEvent, FormEvent, useState } from "react";
import useSignup from "../../../hooks/auth/useSignup";

interface signUpState {
  userName: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [signup, setSignup] = useState<signUpState>({
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignup({ ...signup, [name]: value });
  };

  const { loading, signUp } = useSignup();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signUp(signup);
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
      borderRadius={"10px"}
      boxShadow={"4px 4px 6px #ccc"}
    >
      <Text
        as="h1"
        textAlign={"center"}
        mt={"14px"}
        fontSize={{ sm: "1rem", md: "1.2rem" }}
      >
        Signup
      </Text>
      <form className="signup-form">
        <Box padding={"10px"} margin={"2px 20px 2px 20px"}>
          <Text fontSize={{ sm: "0.9rem", md: "1rem" }}>User Name</Text>
          <Input borderRadius="50px" name="userName" onChange={handleChange} />
        </Box>
        <Box padding={"10px"} margin={"2px 20px 2px 20px"}>
          <Text fontSize={{ sm: "0.9rem", md: "1rem" }}>Email</Text>
          <Input borderRadius="50px" name="email" onChange={handleChange} />
        </Box>
        <Box padding={"10px"} margin={"2px 20px 2px 20px"}>
          <Text fontSize={{ sm: "0.9rem", md: "1rem" }}>Password</Text>
          <Input
            type="password"
            borderRadius="50px"
            name="password"
            onChange={handleChange}
          />
        </Box>
        <Box padding={"10px"} margin={"2px 20px 2px 20px"}>
          <Button
            width="100%"
            borderRadius="30px"
            fontSize={{ sm: "1rem", md: "1.1rem" }}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Sign up
          </Button>
        </Box>
      </form>
      <Box textAlign={"center"}>
        <Box as="span" fontSize={{ sm: "0.9rem", md: "1rem" }}>
          Already have an account?{" "}
          <ChakraLink
            as={Link}
            to="/login"
            _hover={{ color: "blue", textDecoration: "underline" }}
          >
            login
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
          fontSize={{ sm: "1rem", md: "1.1rem" }}
        >
          Continue with Google
        </Button>
      </Box>
    </Box>
  );
};

export default Signup;
