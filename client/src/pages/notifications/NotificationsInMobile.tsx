import { Box, Button, Divider, Text } from "@chakra-ui/react";
import { useAppDispatch } from "../../hooks/hooks";
import { useEffect, useState } from "react";
import { setNotifications } from "../../redux-store/features/notifications/notificationsSlice";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { SlUserFollow } from "react-icons/sl";
import { IoIosNotifications } from "react-icons/io";
import AllNotificationsInMobile from "../../components/notifications/AllNotificationsInMobile";
import FollowRequestNotificationsInMobile from "../../components/notifications/FollowRequestNotificationsInMobile";

const NotificationsInMobile = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isAllNotifications, setIsAllNotifications] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const handleNotifications = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/notification`,
          {
            method: "GET",
            credentials: "include",
          }
        );

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
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={"6px"}
        >
          <Box>
            <Text fontSize={"1.5rem"} fontWeight={"bold"}>
              Notifications
            </Text>
          </Box>
          <Box
            mr={"12px"}
            cursor={"pointer"}
            onClick={() => setIsAllNotifications(!isAllNotifications)}
          >
            {isAllNotifications ? (
              <SlUserFollow size={"1.6rem"} />
            ) : (
              <IoIosNotifications size={"1.9rem"} />
            )}
          </Box>
        </Box>
      </Box>
      <Divider mb={"10px"} />
      <Box overflow={"auto"} height={"81vh"}>
        {isAllNotifications ? (
          <AllNotificationsInMobile />
        ) : (
          <FollowRequestNotificationsInMobile />
        )}
      </Box>
    </>
  );
};

export default NotificationsInMobile;
