import { Box, Heading, Text } from "@chakra-ui/react";
import ConfirmDeactivateAccount from "./ConfirmDeactivateAccount";
import ConfirmDeleteAccount from "./ConfirmDeleteAccount";

const SettingSection = ({
  title,
  action,
}: {
  title: string;
  action: JSX.Element;
}) => {
  return (
    <Box
      width={{ md: "85%" }}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      border={"1px solid #f2f2f2"}
      borderRadius={"10px"}
      boxShadow={"4px 4px 6px #ccc"}
      p={"10px 20px"}
    >
      <Text fontSize={"1.2rem"} fontWeight={"500"}>
        {title}
      </Text>
      {action}
    </Box>
  );
};

const AdvancedAccountSettings = () => {
  return (
    <>
      <Box
        px={"20px"}
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        gap={{ xs: "30px", md: "35px" }}
        p={{ xs: "25px", md: "25px 20px 0px 40px" }}
      >
        <Heading fontSize={"1.5rem"} fontWeight={"500"}>
          Advanced settings
        </Heading>

        <SettingSection
          title="Deactivate account"
          action={<ConfirmDeactivateAccount />}
        />

        <SettingSection
          title="Delete account"
          action={<ConfirmDeleteAccount />}
        />
      </Box>
    </>
  );
};

export default AdvancedAccountSettings;
