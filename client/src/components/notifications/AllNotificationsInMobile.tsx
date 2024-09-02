import { Avatar, Box, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";
import { readNotification } from "../../redux-store/features/notifications/notificationsSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import AllNotificationsInMobileSkeleton from "../../mobileComponentSkeletons/AllNotificationsInMobileSkeleton";
import useReadNotification from "../../hooks/notifications/useReadNotification";

const AllNotificationsInMobile = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );

  const allAreFollowRequests = notifications.every(
    (notification) => notification.type === "followRequest"
  );

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (notifications) setLoading(false);
  }, [notifications]);

  const { readNotifications } = useReadNotification();

  const handleNotificationRead = async (id: string) => {
    try {
      await readNotifications(id);
      dispatch(readNotification(id));
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return loading ? (
    <AllNotificationsInMobileSkeleton />
  ) : (
    <Box overflow={"auto"} height={"81vh"}>
      {notifications.length === 0 ? (
        <Text textAlign={"center"} mt={"60px"} fontSize={"1.2rem"}>
          You have no notifications at this time.
        </Text>
      ) : allAreFollowRequests ? (
        <>
          <Text textAlign={"center"} fontWeight={"500"} fontSize={"1.3rem"}>
            Activity On Your Posts
          </Text>
          <Text mt={"60px"} fontWeight={"400"} fontSize={"1.2rem"} m={"20px"}>
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
              p={"6px 0px 5px 15px"}
              borderRadius={"5px"}
              onClick={
                notification.isRead
                  ? undefined
                  : () => handleNotificationRead(notification.id)
              }
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
          ) : null
        )
      )}
    </Box>
  );
};

export default AllNotificationsInMobile;
