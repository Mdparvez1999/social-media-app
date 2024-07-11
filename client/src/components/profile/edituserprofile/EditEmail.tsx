import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { ChangeEvent, useState } from "react";
import { updateEmail } from "../../../redux-store/features/profile/profileSlice";
import { toast } from "react-toastify";

const EditEmail = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);

  const [email, setEmail] = useState<string | null>(profile?.bio || "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await fetch("/api/user/profile/email", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      dispatch(updateEmail(data.email));

      toast.success(data.message);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Box width={"90%"}>
        <Text fontSize={"1.2rem"} fontWeight={"500"}>
          Email
        </Text>
        <Box width="100%" display={"flex"} justifyContent={"space-between"}>
          <Input
            width={"85%"}
            defaultValue={profile?.email}
            onChange={handleChange}
          />
          <Button onClick={handleUpdateEmail}>Submit</Button>
        </Box>
      </Box>
    </>
  );
};

export default EditEmail;
