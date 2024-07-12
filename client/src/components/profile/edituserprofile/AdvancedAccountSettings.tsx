import { Box, Heading, Text } from "@chakra-ui/react";
import ConfirmDeactivateAccount from "./ConfirmDeactivateAccount";
import ConfirmDeleteAccount from "./ConfirmDeleteAccount";

const AdvancedAccountSettings = () => {
  return (
    <>
      <Box
        px={"20px"}
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        gap={"35px"}
        p={"25px 20px 0px 40px"}
      >
        <Heading fontSize={"1.5rem"} fontWeight={"500"}>
          Advanced settings
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
            Deactivate account
          </Text>
          <ConfirmDeactivateAccount />
        </Box>

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
            Delete account
          </Text>
          <ConfirmDeleteAccount />
        </Box>
      </Box>
    </>
  );
};

export default AdvancedAccountSettings;
