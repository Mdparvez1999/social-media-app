import { Box, Heading } from "@chakra-ui/react";
import EditProfilePic from "./EditProfilePic";
import EditBio from "./EditBio";
import EditEmail from "./EditEmail";
import EditDOB from "./EditDOB";
import EditGender from "./EditGender";
import EditFullName from "./EditFullName";

const EditGeneralDetails = () => {
  return (
    <>
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        gap={"20px"}
        p={"25px 20px 0px 40px"}
      >
        <Heading fontSize={"1.5rem"} fontWeight={"500"}>
          Edit Profile
        </Heading>

        <Box>
          <EditProfilePic />
        </Box>
        <Box>
          <EditFullName />
        </Box>
        <Box>
          <EditBio />
        </Box>
        <Box>
          <EditEmail />
        </Box>
        <Box>
          <EditDOB />
        </Box>
        <Box>
          <EditGender />
        </Box>
      </Box>
    </>
  );
};

export default EditGeneralDetails;
