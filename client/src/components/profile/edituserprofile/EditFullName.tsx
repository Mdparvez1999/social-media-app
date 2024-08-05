import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { updateFullName } from "../../../redux-store/features/profile/profileSlice";
import { toast } from "react-toastify";
import { Box, Button, Input, Text } from "@chakra-ui/react";

const EditFullName = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);

  const [fullName, setFullName] = useState<string>(profile?.fullName || "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFullName(value);
  };

  const handleUpdateFullName = async () => {
    try {
      const response = await fetch("/api/user/profile/fullname", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName }),
      });

      const data = await response.json();

      dispatch(updateFullName(data.fullName));

      toast.success(data.message);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Box width={{ xs: "92%", md: "90%" }}>
        <Text fontSize={"1.2rem"} fontWeight={"500"}>
          FullName
        </Text>
        <Box width="100%" display={"flex"} justifyContent={"space-between"}>
          <Input
            type="text"
            width={{ xs: "70%", md: "85%" }}
            placeholder={profile?.fullName ? profile.fullName : "add fullname"}
            value={profile?.fullName ? profile.fullName : fullName}
            onChange={handleChange}
          />
          <Button onClick={handleUpdateFullName}>Submit</Button>
        </Box>
      </Box>
    </>
  );
};

export default EditFullName;
