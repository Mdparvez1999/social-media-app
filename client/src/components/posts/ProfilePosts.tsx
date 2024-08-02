import {
  Box,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import CurrentUserPosts from "./CurrentUserPosts";
import CurrentUserSavedPosts from "./CurrentUserSavedPosts";

const ProfilePosts = () => {
  return (
    <Box width={"100%"} minHeight={"10vh"}>
      <Tabs align="center" variant="unstyled" isLazy>
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Saved</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />

        <TabPanels>
          <TabPanel>
            <CurrentUserPosts />
          </TabPanel>
          <TabPanel>
            <CurrentUserSavedPosts />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProfilePosts;
