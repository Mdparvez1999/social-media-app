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
import { useState } from "react";
import { toast } from "react-toastify";
import useUnfollowUser from "../../hooks/usersprofile/useUnfollowUser";

interface ViewFollowingUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewFollowingUsersModal = ({
  isOpen,
  onClose,
}: ViewFollowingUsersModalProps) => {
  const followingUsers = useAppSelector((state) => state.profile.following);

  const [loading, setLoading] = useState<boolean>(false);

  const { unfollowUser } = useUnfollowUser();

  const unfollowUserClick = async (id: string) => {
    setLoading(true);
    try {
      await unfollowUser(id);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={{ xs: "92vw", md: "390px" }}>
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
                      size={"md"}
                      crossOrigin="anonymous"
                      src={
                        followinguser.profilePic
                          ? `http://localhost:8000/uploads/profilePic/${followinguser.profilePic}`
                          : undefined
                      }
                      name={followinguser.username}
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
                  <Button
                    onClick={() => unfollowUserClick(followinguser.id)}
                    isLoading={loading}
                  >
                    unfollow
                  </Button>
                </Box>
              ))
            ) : (
              <Text textAlign={"center"}>you are not following anyone</Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewFollowingUsersModal;
