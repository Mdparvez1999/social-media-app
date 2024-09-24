import { Avatar, Box, Text, useDisclosure } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";
import { readNotification } from "../../redux-store/features/notifications/notificationsSlice";
import { toast } from "react-toastify";
import AcceptOrDeclineFollowRequest from "../profile/AcceptOrDeclineFollowRequest";
import { setSingleSentRequest } from "../../redux-store/features/profile/profileSlice";
import useFetchUsersProfile from "../../hooks/usersprofile/useFetchUsersProfile";
import { setSelectedUser } from "../../redux-store/features/users/userSlice";
import useFetchSentRequests from "../../hooks/profile/useFetchSentRequests";

interface UserInfo {
  id: string;
  username: string;
  profilePic: string;
}

interface NotificationState {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  sentBy: UserInfo;
  receivedBy: UserInfo;
}

interface FollowRequestState {
  id: string;
  status: string;
  requestedUser: UserInfo;
  recievedUser: UserInfo;
}

const FollowRequestNotifications = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();

  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );
  const singleSentRequest = useAppSelector(
    (state) => state.profile.setSingleSentRequest
  );

  const { fetchUsersProfile } = useFetchUsersProfile();
  const { fetchSentRequests } = useFetchSentRequests();

  const handleNotificationRead = async (notification: NotificationState) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/notification/read/${
          notification?.id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to read notification");

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      const sentByUser = await fetchUsersProfile(notification.sentBy.id);

      const { sentRequests } = await fetchSentRequests(notification.sentBy.id);

      const currentSentRequest = sentRequests?.find(
        (sentRequest: FollowRequestState) =>
          sentRequest?.requestedUser?.id === notification?.sentBy?.id
      );

      dispatch(setSelectedUser(sentByUser));
      dispatch(readNotification(notification.id));
      dispatch(setSingleSentRequest(currentSentRequest));

      onOpen();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <>
      <Box>
        {notifications.length > 0 ? (
          notifications.map((notification) =>
            notification.type === "followRequest" ? (
              <Box
                key={notification.id}
                display="flex"
                alignItems="center"
                mb={"20px"}
                gap={"6px"}
                width={"100%"}
                cursor={"pointer"}
                bgColor={notification.isRead ? "white" : "gray.100"}
                p={"10px"}
                borderRadius={"5px"}
                onClick={() => handleNotificationRead(notification)}
              >
                <Box>
                  <Avatar
                    crossOrigin="anonymous"
                    name={notification.sentBy.username}
                    src={
                      notification.sentBy.profilePic !== null
                        ? `http://localhost:8000/uploads/profilePic/${notification.sentBy.profilePic}` /* Updated to sentBy */
                        : undefined
                    }
                  />
                </Box>
                <Box display={"flex"} flexDirection={"row"} ml={"12px"}>
                  <Text fontWeight={notification.isRead ? "normal" : "500"}>
                    {notification.message}.{" "}
                    {formatCreatedAtTime(notification.createdAt)}
                  </Text>
                </Box>
              </Box>
            ) : null
          )
        ) : (
          <>
            <Text textAlign={"center"}>Activity On Your Posts</Text>
            <Text mt={"60px"}>
              When someone likes or comments on one of your posts, you'll see it
              here.
            </Text>
          </>
        )}
        {singleSentRequest && (
          <AcceptOrDeclineFollowRequest isOpen={isOpen} onClose={onClose} />
        )}
      </Box>
    </>
  );
};

export default FollowRequestNotifications;
