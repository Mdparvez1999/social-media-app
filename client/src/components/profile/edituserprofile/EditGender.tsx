import { Box, Button, Select, Text } from "@chakra-ui/react";

const EditGender = () => {
  return (
    <>
      <Box width={"90%"}>
        <Text fontSize={"1.2rem"} fontWeight={"500"}>
          Gender
        </Text>
        <Box width="100%" display={"flex"} justifyContent={"space-between"}>
          <Select width={"85%"}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
          <Button>Submit</Button>
        </Box>
      </Box>
    </>
  );
};

export default EditGender;
