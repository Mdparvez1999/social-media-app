import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../.././hooks/hooks";
import { setCurrentUser } from "../../redux-store/features/auth/authSlice";

interface ActivateAccountProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivateAccount = ({ isOpen, onClose }: ActivateAccountProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cancelRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleActivate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/user/profile/activate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === "fail" || data.status === "error") {
        throw new Error(data.message);
      }

      dispatch(setCurrentUser(data.user));
      toast.success(data.message);

      navigate("/app/home");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

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
            <Button mr={3} onClick={handleActivate} isLoading={loading}>
              Yes, Activate
            </Button>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ActivateAccount;
