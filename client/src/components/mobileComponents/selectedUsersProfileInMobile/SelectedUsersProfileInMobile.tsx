import { Box, Divider } from "@chakra-ui/react";
import SelectedUsersProfileDetailsInMobile from "./SelectedUsersProfileDetailsInMobile";
import SelectedUsersPostsInMobile from "./SelectedUsersPostsInMobile";

const SelectedUsersProfileInMobile = () => {
  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
    >
      <SelectedUsersProfileDetailsInMobile />
      <Divider />
      <SelectedUsersPostsInMobile />
    </Box>
  );
};

export default SelectedUsersProfileInMobile;
