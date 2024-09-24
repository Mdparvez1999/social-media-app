import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { toast } from "react-toastify";
import {
  NotificationState,
  setNotifications,
} from "../../redux-store/features/notifications/notificationsSlice";
import FollowRequestNotifications from "../../components/notifications/FollowRequestNotifications";
import { IoArrowBack } from "react-icons/io5";
import { SlUserFollow } from "react-icons/sl";
import { IoIosNotifications } from "react-icons/io";
import AllNotifications from "../../components/notifications/AllNotifications";
import NotificationsSkeleton from "../../skeletons/NotificationsSkeleton";
import useFetchGetObjectUrlForAllProfilePics from "../../hooks/usersprofile/useFetchGetObjectUrlForAllProfilePics";

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Notifications = ({ isOpen, onClose }: NotificationsProps) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [isAllNotifications, setIsAllNotifications] = useState<boolean>(true);

  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();

  useEffect(() => {
    let isMounted = true;

    const handleNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/notification`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();

        if (data.status === "error" || data.status === "fail") {
          throw new Error(data.message);
        }

        const notificationData = data.data;

        const uniqueUrls = new Map();

        notificationData.forEach((notification: NotificationState) => {
          const { id: userId, profilePic } = notification.sentBy;

          if (!uniqueUrls.has(profilePic)) {
            uniqueUrls.set(userId, profilePic);
          }
        });

        const profilePicUrls = await fetchGetObjectUrlForAllProfilePics([
          ...uniqueUrls.values(),
        ]);

        const updatedNotificationData = notificationData.map(
          (notification: NotificationState) => {
            const updatedSentBy = { ...notification.sentBy };

            return {
              ...notification,
              sentBy: {
                ...updatedSentBy,
                profilePic: profilePicUrls?.find((url) => {
                  return url.includes(uniqueUrls.get(updatedSentBy.id));
                }),
              },
            };
          }
        );

        if (isMounted) {
          dispatch(setNotifications(updatedNotificationData));
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };
    handleNotifications();

    return () => {
      isMounted = false;
    };
  }, [dispatch, fetchGetObjectUrlForAllProfilePics]);

  return loading ? (
    <NotificationsSkeleton isOpen={isOpen} onClose={onClose} />
  ) : (
    <>
      <Box>
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          <DrawerOverlay />
          <DrawerContent>
            <Box display={"flex"} alignItems={"center"} px={"24px"}>
              <Box onClick={onClose} cursor={"pointer"}>
                <IoArrowBack size={"1.6rem"} />
              </Box>
              <DrawerHeader>Notifications</DrawerHeader>
              <Box
                ml={"auto"}
                cursor={"pointer"}
                onClick={() => setIsAllNotifications(!isAllNotifications)}
              >
                {isAllNotifications ? (
                  <SlUserFollow size={"1.4rem"} />
                ) : (
                  <IoIosNotifications size={"1.7rem"} />
                )}
              </Box>
            </Box>
            <Divider />
            <DrawerBody p={"20px"}>
              {isAllNotifications ? (
                <AllNotifications />
              ) : (
                <FollowRequestNotifications />
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};

export default Notifications;
