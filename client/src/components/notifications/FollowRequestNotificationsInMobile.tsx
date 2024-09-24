import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import useFetchSentRequests from "../../hooks/profile/useFetchSentRequests";
import useFetchUsersProfile from "../../hooks/usersprofile/useFetchUsersProfile";
import { readNotification } from "../../redux-store/features/notifications/notificationsSlice";
import { setSingleSentRequest } from "../../redux-store/features/profile/profileSlice";
import { setSelectedUser } from "../../redux-store/features/users/userSlice";
import { Avatar, Box, Text } from "@chakra-ui/react";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";

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

const FollowRequestNotificationsInMobile = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
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
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const followRequestNotifications = notifications.filter(
    (notification) => notification.type === "followRequest"
  );

  return (
    <Box overflow={"auto"} height={"81vh"}>
      {notifications.length === 0 ? (
        <Text
          textAlign={"center"}
          mt={"60px"}
          fontWeight={"400"}
          fontSize={"1.2rem"}
        >
          You have no notifications at this time.
        </Text>
      ) : followRequestNotifications.length === 0 ? (
        <>
          <Text textAlign={"center"} fontWeight={"500"} fontSize={"1.3rem"}>
            Activity On Your Requests
          </Text>
          <Text mt={"60px"} fontWeight={"400"} fontSize={"1.2rem"} m={"20px"}>
            When someone sends you a follow request, you'll see it here.
          </Text>
        </>
      ) : (
        followRequestNotifications.map((notification) => (
          <Box
            key={notification.id}
            display="flex"
            alignItems="center"
            mb={"20px"}
            gap={"6px"}
            width={"100%"}
            cursor={"pointer"}
            bgColor={notification.isRead ? "white" : "gray.100"}
            p={"6px 0px 5px 15px"}
            borderRadius={"5px"}
            onClick={() => handleNotificationRead(notification)}
          >
            <Box>
              <Avatar
                crossOrigin="anonymous"
                name={notification.sentBy.username}
                src={
                  notification.sentBy.profilePic !== null
                    ? `http://localhost:8000/uploads/profilePic/${notification.sentBy.profilePic}`
                    : undefined
                }
              />
            </Box>
            <Box display={"flex"} flexDirection={"row"} ml={"12px"}>
              <Text
                fontSize={"1.3rem"}
                fontWeight={notification.isRead ? "normal" : "500"}
              >
                {notification.message}.{" "}
                {formatCreatedAtTime(notification.createdAt)}
              </Text>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default FollowRequestNotificationsInMobile;
