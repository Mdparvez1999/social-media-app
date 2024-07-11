import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { ChangeEvent, useState } from "react";
import { updateBio } from "../../../redux-store/features/profile/profileSlice";
import { toast } from "react-toastify";

const EditBio = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);

  const [bio, setBio] = useState<string | null>(profile?.bio || "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBio(value);
  };

  const handleUpdateBio = async () => {
    try {
      const response = await fetch("/api/user/profile/bio", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      });

      const data = await response.json();

      dispatch(updateBio(data.bio));

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
          Bio
        </Text>
        <Box width="100%" display={"flex"} justifyContent={"space-between"}>
          <Input
            width={"85%"}
            defaultValue={profile?.bio === null ? "add bio" : profile?.bio}
            onChange={handleChange}
          />
          <Button onClick={handleUpdateBio}>Submit</Button>
        </Box>
      </Box>
    </>
  );
};

export default EditBio;
