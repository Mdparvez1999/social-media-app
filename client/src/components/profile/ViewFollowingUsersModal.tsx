import React, { useState, useCallback, useEffect } from "react";
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
import { toast } from "react-toastify";
import useUnfollowUser from "../../hooks/usersprofile/useUnfollowUser";
import useFollowUser from "../../hooks/usersprofile/useFollowUser";

interface ViewFollowingUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewFollowingUsersModal = React.memo(
  ({ isOpen, onClose }: ViewFollowingUsersModalProps) => {
    const currentUserFollowing = useAppSelector(
      (state) => state.profile.following
    );

    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [followingState, setFollowingState] = useState<
      Record<string, boolean>
    >({});

    useEffect(() => {
      if (currentUserFollowing) {
        const initialFollowingState = currentUserFollowing.reduce(
          (acc, user) => {
            acc[user?.id] = true;
            return acc;
          },
          {} as Record<string, boolean>
        );
        setFollowingState(initialFollowingState);
      }
    }, [currentUserFollowing]);

    const { followUser } = useFollowUser();
    const { unfollowUser } = useUnfollowUser();

    const handleFollowUnfollowClick = useCallback(
      async (id: string, isFollowing: boolean) => {
        setLoading((prev) => ({ ...prev, [id]: true }));
        try {
          if (isFollowing) {
            await unfollowUser(id);
          } else {
            await followUser(id);
          }

          setFollowingState((prev) => ({ ...prev, [id]: !isFollowing }));
        } catch (error) {
          toast.error("Something went wrong");
        } finally {
          setLoading((prev) => ({ ...prev, [id]: false }));
        }
      },
      [followUser, unfollowUser]
    );

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
            <Box maxHeight={"300px"} overflowY={"auto"}>
              {currentUserFollowing && currentUserFollowing.length > 0 ? (
                currentUserFollowing.map((user) => {
                  const isFollowing = followingState[user?.id];
                  return (
                    <Box
                      key={user?.id}
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
                          src={user.profilePic}
                          name={user?.userName}
                        />
                        <Box mb={"8px"}>
                          <Text fontWeight={"bold"} fontSize={"1.3rem"}>
                            {user?.userName}
                          </Text>
                          {user?.fullName && (
                            <Text fontSize={"1rem"}>{user?.fullName}</Text>
                          )}
                        </Box>
                      </Box>
                      <Button
                        width={"100px"}
                        onClick={() =>
                          handleFollowUnfollowClick(user.id, isFollowing)
                        }
                        isLoading={loading[user?.id]}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    </Box>
                  );
                })
              ) : (
                <Text textAlign={"center"} m={"10px 0 30px 0"}>
                  you are not following anyone
                </Text>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

export default ViewFollowingUsersModal;
