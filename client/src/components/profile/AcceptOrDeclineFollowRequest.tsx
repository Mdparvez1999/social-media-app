import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import useAcceptFollowRequest from "../../hooks/profile/useAcceptFollowRequest";
import useDeclineFollowRequest from "../../hooks/profile/useDeclineFollowRequest";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  addFollowers,
  removeFollowRequest,
} from "../../redux-store/features/profile/profileSlice";
import { addSelectedUsersFollowing } from "../../redux-store/features/users/userSlice";

interface AcceptOrDeclineFollowRequestProps {
  isOpen: boolean;
  onClose: () => void;
}

const AcceptOrDeclineFollowRequest = ({
  isOpen,
  onClose,
}: AcceptOrDeclineFollowRequestProps) => {
  const dispatch = useAppDispatch();

  const singleSentRequest = useAppSelector(
    (state) => state.profile.setSingleSentRequest
  );
  const selecteduser = useAppSelector((state) => state.users.selectedUser);

  const cancelRef = useRef(null);

  const { acceptRequestLoading, acceptFollowRequest } =
    useAcceptFollowRequest();
  const { declineRequestLoading, declineFollowRequest } =
    useDeclineFollowRequest();

  const handleAcceptFollowRequest = async () => {
    if (!singleSentRequest) return;
    try {
      const data = await acceptFollowRequest(singleSentRequest.id);
      dispatch(addFollowers(data.follower));
      dispatch(addSelectedUsersFollowing(data.following));
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleDeclineFollowRequest = async () => {
    try {
      if (!singleSentRequest) return;
      await declineFollowRequest(singleSentRequest.id);
      dispatch(removeFollowRequest(selecteduser?.id as string));
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent maxWidth={{ xs: "350px", md: "36%" }}>
          <AlertDialogHeader>Respond to Follow Request</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Would you like to accept or decline this follow request?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              mr={3}
              onClick={handleAcceptFollowRequest}
              isLoading={acceptRequestLoading}
            >
              Accept
            </Button>
            <Button
              ref={cancelRef}
              onClick={handleDeclineFollowRequest}
              isLoading={declineRequestLoading}
            >
              Decline
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AcceptOrDeclineFollowRequest;
