import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../../hooks/hooks";

const EditEmail = () => {
  const profile = useAppSelector((state) => state.profile.profile);

  return (
    <>
      <Box width={"90%"}>
        <Text fontSize={"1.2rem"} fontWeight={"500"}>
          Email
        </Text>
        <Box width="100%" display={"flex"} justifyContent={"space-between"}>
          <Input width={"85%"} />
          <Button>Submit</Button>
        </Box>
      </Box>
    </>
  );
};

export default EditEmail;
