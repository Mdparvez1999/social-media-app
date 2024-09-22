import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useState } from "react";
import { removeSentRequest } from "../../redux-store/features/profile/profileSlice";

interface CancelFollowRequestProps {
  selectedUserId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}
const CancelFollowRequest = ({
  // selectedUserId,
  isOpen,
  onClose,
}: CancelFollowRequestProps) => {
  const dispatch = useAppDispatch();
  const sentRequests = useAppSelector((state) => state.profile.sentRequests);

  const currentUserId = useAppSelector((state) => state.profile.profile?.id);

  const [loading, setLoading] = useState<boolean>(false);

  if (sentRequests?.length === 0) return null;

  const sentRequestId = sentRequests?.find(
    (req) => req.requestedUser?.id === currentUserId
    // req.recievedUser?.id === selectedUserId
  )?.id;

  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/users/cancel-request/${sentRequestId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      dispatch(removeSentRequest(sentRequestId as string));
      // dispatch(setIsRequestPending(false));
      toast.success(data.message);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
      onClose();
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cancel Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Do you want to cancel the follow request?</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCancelRequest} isLoading={loading}>
            Cancel Request
          </Button>
          <Button onClick={onClose} ml={3}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CancelFollowRequest;
