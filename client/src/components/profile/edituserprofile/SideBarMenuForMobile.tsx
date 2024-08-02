import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import UserProfileSidebar from "./UserProfileSideBar";

interface SideBarMenuForMobileProps {
  isOpen: boolean;
  onClose: () => void;
}
const SideBarMenuForMobile = ({
  isOpen,
  onClose,
}: SideBarMenuForMobileProps) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxWidth={"250px"}>
        <DrawerCloseButton />
        <DrawerHeader>Settings</DrawerHeader>

        <DrawerBody p={0} width={"80%"} pl={"8px"}>
          <UserProfileSidebar onClose={onClose} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideBarMenuForMobile;
