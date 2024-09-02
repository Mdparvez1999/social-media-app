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
        p={{ xs: "25px", md: "25px 20px 0px 40px" }}
      >
        <Heading fontSize={"1.5rem"} fontWeight={"500"}>
          Password and Security
        </Heading>

        <Box width={"100%"}>
          <Text
            fontSize={"1.2rem"}
            fontWeight={"500"}
            display={{ xs: "none", md: "block" }}
          >
            Password
          </Text>
          <Box
            width={{ xs: "100%", md: "90%" }}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Input
              width={{ xs: "70%", md: "75%" }}
              placeholder="********"
              isReadOnly
            />
            <Button
              onClick={onOpen}
              width={{ xs: "25%", md: "40%" }}
              display={{ xs: "block", md: "none" }}
            >
              update
            </Button>
            <Button onClick={onOpen} display={{ xs: "none", md: "block" }}>
              Change Password
            </Button>
          </Box>
        </Box>
      </Box>

      <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default EditPassword;
