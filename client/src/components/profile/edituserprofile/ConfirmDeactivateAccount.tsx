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
import { useRef, useState } from "react";
import { useAppDispatch } from "../../../hooks/hooks";
import { updateActiveStatus } from "../../../redux-store/features/profile/profileSlice";
import { toast } from "react-toastify";
import { logoutCurrentUser } from "../../../redux-store/features/auth/authSlice";

const ConfirmDeactivateAccount = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/user/profile/deactivate`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      dispatch(updateActiveStatus(data.isActive));
      dispatch(logoutCurrentUser());

      toast.success(data.message);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Confirm</Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent maxWidth={{ xs: "350px", md: "50%" }}>
            <AlertDialogHeader>Deactivate account</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              you will have one month to reactivate your account, after that
              your account will be deleted. Are you sure you want to deactivate
              your account?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                onClick={handleDeactivate}
                isLoading={loading}
                loadingText="Deactivating"
              >
                Deactivate
              </Button>
              <Button onClick={onClose} ml={"16px"}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmDeactivateAccount;
