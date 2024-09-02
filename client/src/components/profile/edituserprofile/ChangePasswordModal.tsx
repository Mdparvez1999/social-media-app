import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "oldPassword") {
      setOldPassword(e.target.value);
    } else if (e.target.name === "newPassword") {
      setNewPassword(e.target.value);
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/profile/change-password", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      toast.success(data.message);

      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={{ xs: "350px", md: "35%" }}>
          <ModalHeader textAlign={"center"}>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              width={"100%"}
              display={"flex"}
              flexDirection={"column"}
              gap={"6px"}
              mb={"20px"}
            >
              <Text fontSize={"1.2rem"} fontWeight={"500"}>
                old password
              </Text>
              <Input
                type="password"
                name="oldPassword"
                onChange={handleChange}
                autoFocus
              />
            </Box>
            <Box
              width={"100%"}
              display={"flex"}
              flexDirection={"column"}
              gap={"6px"}
            >
              <Text fontSize={"1.2rem"} fontWeight={"500"}>
                new password
              </Text>
              <Input
                type="password"
                name="newPassword"
                onChange={handleChange}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleUpdatePassword} isLoading={loading}>
              update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
