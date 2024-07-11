import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../../hooks/hooks";

const EditBio = () => {
  const profile = useAppSelector((state) => state.profile.profile);
  return (
    <>
      <Box width={"90%"}>
        <Text fontSize={"1.2rem"} fontWeight={"500"}>
          Bio
        </Text>
        <Box width="100%" display={"flex"} justifyContent={"space-between"}>
          <Input
            width={"85%"}
            value={profile?.bio === null ? "add bio" : profile?.bio}
          />
          <Button>Submit</Button>
        </Box>
      </Box>
    </>
  );
};

export default EditBio;
