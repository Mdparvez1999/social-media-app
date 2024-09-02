import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useAppSelector } from "../../../hooks/hooks";
import usePrivacy from "../../../hooks/profile/usePrivacy";
import { toast } from "react-toastify";

const PrivacySettingConfirm = () => {
  const profile = useAppSelector((state) => state.profile.profile);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelref = useRef(null);

  const { makePrivate, makePublic } = usePrivacy();

  const handlePrivacyClick = async () => {
    try {
      if (!profile?.isPrivate) {
        await makePrivate();
        onClose();
      } else {
        await makePublic();
        onClose();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Switch onChange={onOpen} isChecked={profile?.isPrivate} />
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelref}
      >
        <AlertDialogOverlay>
          <AlertDialogContent maxWidth={{ xs: "350px", md: "38%" }}>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              textAlign={"center"}
            >
              {profile?.isPrivate ? "switch to public?" : "switch to private?"}
            </AlertDialogHeader>
            <Divider />
            <AlertDialogBody fontSize={"1.1rem"} fontWeight={"500"}>
              {profile?.isPrivate
                ? "Your profile is currently private. Only approved followers can see your posts. Do you want to make your profile public?"
                : "Your profile is currently public. Anyone can see your posts. Do you want to make your profile private?"}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handlePrivacyClick}>confirm</Button>
              <Button onClick={onClose} ref={cancelref} ml={"16px"}>
                cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default PrivacySettingConfirm;
