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
import { setNotifications } from "../../redux-store/features/notifications/notificationsSlice";
import FollowRequestNotifications from "../../components/notifications/FollowRequestNotifications";
import { IoArrowBack } from "react-icons/io5";
import { SlUserFollow } from "react-icons/sl";
import { IoIosNotifications } from "react-icons/io";
import AllNotifications from "../../components/notifications/AllNotifications";
import NotificationsSkeleton from "../../skeletons/NotificationsSkeleton";

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Notifications = ({ isOpen, onClose }: NotificationsProps) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [isAllNotifications, setIsAllNotifications] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const handleNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/notification", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();

        if (data.status === "error" || data.status === "fail") {
          throw new Error(data.message);
        }

        if (isMounted) {
          dispatch(setNotifications(data.data));
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
  }, [dispatch]);

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
