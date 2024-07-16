import {
  Avatar,
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";

interface SelectedUsersFollowingProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectedUsersFollowing = ({
  isOpen,
  onClose,
}: SelectedUsersFollowingProps) => {
  const selectedUsersFollowing = useAppSelector(
    (state) => state.users.selectedUsersFollowing
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={"390px"}>
        <ModalCloseButton />
        <ModalHeader>
          <Text textAlign={"center"}>Following</Text>
        </ModalHeader>
        <Divider width={"85%"} margin={"auto"} />
        <ModalBody>
          <Box>
            {selectedUsersFollowing?.length > 0 ? (
              selectedUsersFollowing?.map((follower) => (
                <Box
                  key={follower.id}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={"12px"}
                  px={"3px"}
                  maxHeight={"300px"}
                  overflow={"auto"}
                >
                  <Box display={"flex"} gap={"10px"} alignItems={"center"}>
                    <Avatar
                      src={`http://localhost:8000/uploads/profilePic/${follower.profilePic}`}
                      size={"md"}
                      name={follower.username}
                      crossOrigin="anonymous"
                    />
                    <Box mb={"8px"}>
                      <Text fontWeight={"bold"} fontSize={"1.3rem"}>
                        {follower.username}
                      </Text>
                      {follower.fullName && (
                        <Text fontSize={"1rem"}>{follower.fullName}</Text>
                      )}
                    </Box>
                  </Box>
                  <Button>Remove</Button>
                </Box>
              ))
            ) : (
              <Text textAlign={"center"}>not following anyone</Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SelectedUsersFollowing;
