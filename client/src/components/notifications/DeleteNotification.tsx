import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

const DeleteNotification = () => {
  const { isOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent maxWidth={{ xs: "350px", md: "50%" }}>
          <AlertDialogHeader>Activate Your Account</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Your account is currently deactivated. Would you like to activate it
            to access all features?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef}>delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteNotification;
