import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { toast } from "react-toastify";
import {
  readNotification,
  setNotifications,
} from "../../redux-store/features/notifications/notificationsSlice";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Notifications = ({ isOpen, onClose }: NotificationsProps) => {
  const dispatch = useAppDispatch();

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

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Notifications</DrawerHeader>
          <Divider />
          <DrawerBody p={"20px"}>
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
                  p={"10px"}
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
                    <Text fontWeight={notification.isRead ? "normal" : "500"}>
                      {notification.message}.{" "}
                      {formatCreatedAtTime(notification.createdAt)}
                    </Text>
                  </Box>
                  <Box>
                    {notification.type === "follow" ? (
                      <Box>
                        <Button size={"sm"} ml={"auto"}>
                          Follow
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
                  When someone likes or comments on one of your posts, you'll
                  see it here.
                </Text>
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Notifications;
