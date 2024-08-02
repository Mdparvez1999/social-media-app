import {
  Box,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import CurrentUserPostsMobile from "./CurrentUserPostsMobile";

const ProfilePostsMobile = () => {
  return (
    <Box width={"100%"} minHeight={"10vh"}>
      <Tabs align="center" variant="unstyled" isLazy>
        <TabList>
          <Tab>Posts</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />

        <TabPanels>
          <TabPanel p={0}>
            <CurrentUserPostsMobile />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProfilePostsMobile;
