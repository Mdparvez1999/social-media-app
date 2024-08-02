import { Avatar, Box, Button, Divider, Text } from "@chakra-ui/react";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useEffect } from "react";
import {
  readNotification,
  setNotifications,
} from "../../redux-store/features/notifications/notificationsSlice";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const NotificationsInMobile = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const navigate = useNavigate();

  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );

  useEffect(() => {
    let isMounted = true;

    const handleNotifications = async () => {
      try {
        const response = await fetch("/api/notification", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const { data } = await response.json();

        if (data.status === "error" || data.status === "fail") {
          throw new Error(data.message);
        }

        if (isMounted) {
          dispatch(setNotifications(data));
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };
    handleNotifications();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const handleNotificationRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notification/read/${id}`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to read notification");

      const { data } = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      dispatch(readNotification(id));
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  const handleClickBack = () => {
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"} p={"10px"} gap={"25px"}>
        <Button onClick={handleClickBack}>
          <IoArrowBack />
        </Button>
        <Text fontSize={"1.5rem"} fontWeight={"bold"}>
          Notifications
        </Text>
      </Box>
      <Divider m={"10px 0px 16px 0px"} />
      <Box overflow={"auto"} height={"81vh"}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
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
              onClick={() => handleNotificationRead(notification.id)}
            >
              <Box>
                <Avatar
                  crossOrigin="anonymous"
                  name={notification.user.username}
                  src={
                    notification.user.profilePic !== null
                      ? `http://localhost:8000/uploads/profilePic/${notification.user.profilePic}`
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
              <Box pl={"20px"}>
                {notification.type === "follow" ? (
                  <Box>
                    <Button size={"sm"} ml={"auto"}>
                      Follow back
                    </Button>
                  </Box>
                ) : null}
              </Box>
            </Box>
          ))
        ) : (
          <>
            <Text textAlign={"center"}>Activity On Your Posts</Text>
            <Text mt={"60px"}>
              When someone likes or comments on one of your posts, you'll see it
              here.
            </Text>
          </>
        )}
      </Box>
    </>
  );
};

export default NotificationsInMobile;
