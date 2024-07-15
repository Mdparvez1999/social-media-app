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

interface ViewFollowingUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewFollowingUsersModal = ({
  isOpen,
  onClose,
}: ViewFollowingUsersModalProps) => {
  const followingUsers = useAppSelector((state) => state.profile.following);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={"390px"}>
        <ModalCloseButton />
        <ModalHeader>
          <Text textAlign={"center"}>Followers</Text>
        </ModalHeader>
        <Divider width={"85%"} margin={"auto"} />
        <ModalBody>
          <Box>
            {followingUsers?.length > 0 ? (
              followingUsers?.map((followinguser) => (
                <Box
                  key={followinguser.id}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={"15px"}
                  px={"3px"}
                  maxHeight={"300px"}
                  overflow={"auto"}
                >
                  <Box display={"flex"} gap={"10px"} alignItems={"center"}>
                    <Avatar
                      src={`http://localhost:8000/uploads/profilePic/${followinguser.profilePic}`}
                      size={"md"}
                      name={followinguser.username}
                      crossOrigin="anonymous"
                    />
                    <Box mb={"8px"}>
                      <Text fontWeight={"bold"} fontSize={"1.3rem"}>
                        {followinguser.username}
                      </Text>
                      {followinguser.fullName && (
                        <Text fontSize={"1rem"}>{followinguser.fullName}</Text>
                      )}
                    </Box>
                  </Box>
                  <Button>unfollow</Button>
                </Box>
              ))
            ) : (
              <Text>No followers found.</Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewFollowingUsersModal;
