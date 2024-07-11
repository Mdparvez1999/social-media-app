import { Box, Heading, Text } from "@chakra-ui/react";
import PrivacySettingConfirm from "./PrivacySettingConfirm";

const PrivacySettings = () => {
  return (
    <>
      <Box
        px={"20px"}
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        gap={"35px"}
        p={"25px 0px 0px 30px"}
      >
        <Heading fontSize={"1.5rem"} fontWeight={"500"}>
          Account privacy
        </Heading>

        <Box
          width={"85%"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          border={"1px solid #f2f2f2"}
          borderRadius={"10px"}
          boxShadow={"4px 4px 6px #ccc"}
          p={"10px 20px"}
        >
          <Text fontSize={"1.2rem"} fontWeight={"500"}>
            Private account
          </Text>
          <PrivacySettingConfirm />
        </Box>
      </Box>
    </>
  );
};

export default PrivacySettings;
