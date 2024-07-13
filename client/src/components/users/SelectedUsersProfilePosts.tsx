import {
  Box,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import SelectedUsersPosts from "./SelectedUsersPosts";
import SelectedUsersSavedPosts from "./SelectedUsersSavedPosts";

const SelectedUsersProfilePosts = () => {
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
            <SelectedUsersPosts />
          </TabPanel>
          <TabPanel>
            <SelectedUsersSavedPosts />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SelectedUsersProfilePosts;
