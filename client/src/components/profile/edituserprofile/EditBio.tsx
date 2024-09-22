import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { ChangeEvent, useState } from "react";
import { updateBio } from "../../../redux-store/features/profile/profileSlice";
import { toast } from "react-toastify";

const EditBio = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);

  const [bio, setBio] = useState<string>(profile?.bio || "");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBio(value);
  };

  const handleUpdateBio = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/user/profile/bio`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bio }),
        }
      );

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      dispatch(updateBio(data.bio));

      toast.success(data.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box width={{ xs: "92%", md: "90%" }}>
      <Text fontSize={"1.2rem"} fontWeight={"500"}>
        Bio
      </Text>
      <Box width="100%" display={"flex"} justifyContent={"space-between"}>
        <Input
          width={{ xs: "70%", md: "85%" }}
          type="text"
          placeholder={profile?.bio ? profile?.bio : "add bio"}
          value={bio}
          onChange={handleChange}
        />
        <Button onClick={handleUpdateBio} isLoading={loading}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default EditBio;
