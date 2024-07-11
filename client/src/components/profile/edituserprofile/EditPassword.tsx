import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import ChangePasswordModal from "./ChangePasswordModal";

const EditPassword = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        minHeight={"100%"}
        gap={"35px"}
        p={"25px 0px 0px 30px"}
      >
        <Heading fontSize={"1.5rem"} fontWeight={"500"}>
          Password and Security
        </Heading>

        <Box width={"90%"}>
          <Text fontSize={"1.2rem"} fontWeight={"500"}>
            Password
          </Text>
          <Box width="100%" display={"flex"} justifyContent={"space-between"}>
            <Input width={"75%"} defaultValue="********" />
            <Button onClick={onOpen}>Change Password</Button>
          </Box>
        </Box>
      </Box>

      <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default EditPassword;
