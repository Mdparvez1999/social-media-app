import {
  Avatar,
  Box,
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

interface SelectedUsersUsersProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectedUsersFollowers = ({
  isOpen,
  onClose,
}: SelectedUsersUsersProps) => {
  const SelectedUsersFollowers = useAppSelector(
    (state) => state.users.selectedUsersFollowers
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={{ xs: "95vw", md: "390px" }}>
        <ModalCloseButton />
        <ModalHeader>
          <Text textAlign={"center"}>Users</Text>
        </ModalHeader>
        <Divider width={"85%"} margin={"auto"} />
        <ModalBody>
          <Box>
            {SelectedUsersFollowers?.length > 0 ? (
              SelectedUsersFollowers?.map((user) =>
                user ? (
                  <Box
                    key={user.id}
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
                        size={"md"}
                        crossOrigin="anonymous"
                        src={
                          user?.profilePic
                            ? `http://localhost:8000/uploads/profilePic/${user.profilePic}`
                            : undefined
                        }
                        name={user?.username}
                      />
                      <Box mb={"8px"}>
                        <Text fontWeight={"bold"} fontSize={"1.3rem"}>
                          {user?.username}
                        </Text>
                        {user?.fullName && (
                          <Text fontSize={"1rem"}>{user.fullName}</Text>
                        )}
                      </Box>
                    </Box>
                    {/* <Button>follow/unfollow</Button> */}
                  </Box>
                ) : null
              )
            ) : (
              <Text textAlign={"center"}>no users</Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SelectedUsersFollowers;
