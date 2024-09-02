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
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useCallback, useEffect, useRef } from "react";
import UseFetchSelectedUsersFollowers from "../../hooks/usersprofile/useFetchSelectedUsersFollowers";
import { toast } from "react-toastify";
import { setSelectedUsersFollowers } from "../../redux-store/features/users/userSlice";

interface SelectedUsersUsersProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectedUsersFollowers = ({
  isOpen,
  onClose,
}: SelectedUsersUsersProps) => {
  const selectedUsersFollowers = useAppSelector(
    (state) => state.users.selectedUsersFollowers
  );

  const hasFetched = useRef(false);

  const dispatch = useAppDispatch();

  const { fetchSelectedUsersFollowers } = UseFetchSelectedUsersFollowers();

  const loadUsersData = useCallback(async () => {
    try {
      const followersData = await fetchSelectedUsersFollowers();
      dispatch(setSelectedUsersFollowers(followersData.data));
      hasFetched.current = true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }, [dispatch, fetchSelectedUsersFollowers]);

  useEffect(() => {
    if (isOpen && !hasFetched.current) loadUsersData();
  }, [isOpen, loadUsersData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={{ xs: "95vw", md: "390px" }}>
        <ModalCloseButton size={"1rem"} m={"15px 10px 0 0"} />
        <ModalHeader>
          <Text textAlign={"center"}>Users</Text>
        </ModalHeader>
        <Divider width={"85%"} margin={"auto"} />
        <ModalBody>
          <Box>
            {!hasFetched.current ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100px"
              >
                <Spinner />
              </Box>
            ) : selectedUsersFollowers?.length > 0 ? (
              selectedUsersFollowers.map((user) =>
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
                        name={user?.userName}
                      />
                      <Box mb={"8px"}>
                        <Text fontWeight={"bold"} fontSize={"1.3rem"}>
                          {user?.userName}
                        </Text>
                        {user?.fullName && (
                          <Text fontSize={"1rem"}>{user.fullName}</Text>
                        )}
                      </Box>
                    </Box>
                    {/* <Button>Follow/Unfollow</Button> */}
                  </Box>
                ) : null
              )
            ) : (
              <Text textAlign={"center"}>No users found.</Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SelectedUsersFollowers;
