import { Box, Heading, Text } from "@chakra-ui/react";

const MessageContainerBox = () => {
  return (
    <Box
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      gap={"12px"}
    >
      <Heading>Your Messages</Heading>
      <Text fontSize={"1.2rem"} color={"gray.500"}>
        Select a conversation or send someone a message to start chatting.
      </Text>
    </Box>
  );
};

export default MessageContainerBox;
