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

interface ViewFollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewFollowersModal = ({ isOpen, onClose }: ViewFollowersModalProps) => {
  const followers = useAppSelector((state) => state.profile.followers);

  // console.log(followers);

  if (!followers) return null;

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
            {followers?.length > 0 ? (
              followers?.map((follower) => (
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
              <Text>No followers found.</Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewFollowersModal;
