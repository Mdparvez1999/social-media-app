import { Avatar, Box, Button, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";
import { readNotification } from "../../redux-store/features/notifications/notificationsSlice";
import { toast } from "react-toastify";

const AllNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );

  const handleNotificationRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notification/read/${id}`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to read notification");

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      dispatch(readNotification(id));
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  // Check if all notifications are of type 'followRequest'
  const allAreFollowRequests = notifications.every(
    (notification) => notification.type === "followRequest"
  );

  return (
    <Box>
      {notifications.length === 0 || allAreFollowRequests ? (
        <>
          <Text textAlign={"center"}>Activity On Your Posts</Text>
          <Text mt={"60px"}>
            When someone likes or comments on one of your posts, you'll see it
            here.
          </Text>
        </>
      ) : (
        notifications.map((notification) =>
          notification.type !== "followRequest" ? (
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
              onClick={() => handleNotificationRead(notification.id)}
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
                <Text fontWeight={notification.isRead ? "normal" : "500"}>
                  {notification.message}.{" "}
                  {formatCreatedAtTime(notification.createdAt)}
                </Text>
              </Box>
              <Box>
                {notification.type === "follow" ? (
                  <Button size={"sm"} ml={"auto"}>
                    Follow
                  </Button>
                ) : null}
              </Box>
            </Box>
          ) : null
        )
      )}
    </Box>
  );
};

export default AllNotifications;
