import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { updateActiveStatus } from "../../../redux-store/features/profile/profileSlice";
import { toast } from "react-toastify";

const ConfirmDeactivateAccount = () => {
  const profile = useAppSelector((state) => state.profile.profile);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef(null);

  const dispatch = useAppDispatch();
  const handleDeactivate = async () => {
    try {
      const response = await fetch("/api/user/profile/deactivate", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      dispatch(updateActiveStatus(data.isActive));

      toast.success(data.message);
      onClose();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Switch onChange={onOpen} isChecked={profile?.isActive} />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Deactivate account</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              you will have one month to reactivate your account, after that
              your account will be deleted. Are you sure you want to deactivate
              your account?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleDeactivate}>Deactivate</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmDeactivateAccount;
