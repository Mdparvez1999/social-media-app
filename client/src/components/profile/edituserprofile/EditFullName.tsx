import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { updateFullName } from "../../../redux-store/features/profile/profileSlice";
import { toast } from "react-toastify";
import { Box, Button, Input, Text } from "@chakra-ui/react";

const EditFullName = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);

  const [fullName, setFullName] = useState<string>(profile?.fullName || "");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleUpdateFullName = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/user/profile/fullname`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName }),
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      dispatch(updateFullName(data.fullName));

      toast.success(data.message);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box width={{ xs: "92%", md: "90%" }}>
      <Text fontSize={"1.2rem"} fontWeight={"500"}>
        Full Name
      </Text>
      <Box width="100%" display={"flex"} justifyContent={"space-between"}>
        <Input
          type="text"
          width={{ xs: "70%", md: "85%" }}
          placeholder={profile?.fullName || "Add full name"}
          value={fullName}
          onChange={handleChange}
        />
        <Button onClick={handleUpdateFullName} isLoading={loading}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default EditFullName;
