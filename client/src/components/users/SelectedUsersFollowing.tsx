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
import { setSelectedUsersFollowing } from "../../redux-store/features/users/userSlice";
import { toast } from "react-toastify";
import useFetchSelectedUsersFollowing from "../../hooks/usersprofile/useFetchSelectedUsersFollowing";

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

  const hasFetched = useRef(false);

  const dispatch = useAppDispatch();

  const { fetchSelectedUsersFollowing } = useFetchSelectedUsersFollowing();

  const loadUsersData = useCallback(async () => {
    try {
      const followingData = await fetchSelectedUsersFollowing();
      dispatch(setSelectedUsersFollowing(followingData.data));
      hasFetched.current = true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  }, [dispatch, fetchSelectedUsersFollowing]);

  useEffect(() => {
    if (isOpen && !hasFetched.current) loadUsersData();
  }, [isOpen, loadUsersData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={{ xs: "95vw", md: "390px" }}>
        <ModalCloseButton size={"1rem"} m={"15px 10px 0 0"} />
        <ModalHeader>
          <Text textAlign={"center"}>Following</Text>
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
            ) : selectedUsersFollowing?.length > 0 ? (
              selectedUsersFollowing.map((user) => (
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
                        user.profilePic
                          ? `http://localhost:8000/uploads/profilePic/${user.profilePic}`
                          : undefined
                      }
                      name={user.userName}
                    />
                    <Box mb={"8px"}>
                      <Text fontWeight={"bold"} fontSize={"1.3rem"}>
                        {user.userName}
                      </Text>
                      {user.fullName && (
                        <Text fontSize={"1rem"}>{user.fullName}</Text>
                      )}
                    </Box>
                  </Box>
                  {/* Add follow/unfollow functionality if needed */}
                </Box>
              ))
            ) : (
              <Text textAlign={"center"}>You are not following anyone.</Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SelectedUsersFollowing;
