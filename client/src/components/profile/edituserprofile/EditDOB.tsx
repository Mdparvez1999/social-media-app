import { Box, Button, Input, Text } from "@chakra-ui/react";

const EditDOB = () => {
  return (
    <>
      <Box width={"90%"}>
        <Text fontSize={"1.2rem"} fontWeight={"500"}>
          DOB
        </Text>
        <Box width="100%" display={"flex"} justifyContent={"space-between"}>
          <Input type="date" width={"85%"} />
          <Button>Submit</Button>
        </Box>
      </Box>
    </>
  );
};

export default EditDOB;
