import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

interface NotificationsSkeletonProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsSkeleton = ({
  isOpen,
  onClose,
}: NotificationsSkeletonProps) => {
  const notifications = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <Box>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <Box display={"flex"} alignItems={"center"} px={"24px"}>
            <Box cursor={"pointer"}>
              <Skeleton height="24px" width="24px" />
            </Box>
            <DrawerHeader>
              <Skeleton height="24px" width="150px" />
            </DrawerHeader>
            <Box ml={"auto"} cursor={"pointer"}>
              <Skeleton height="24px" width="24px" />
            </Box>
          </Box>
          <Divider />
          <DrawerBody p={"20px"}>
            {notifications.map((notification) => (
              <Box key={notification}>
                <SkeletonText noOfLines={1} spacing="4" skeletonHeight="44px" />
                <Divider my={"18px"} />
              </Box>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default NotificationsSkeleton;
