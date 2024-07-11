import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { updateDOB } from "../../../redux-store/features/profile/profileSlice";

const EditDOB = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);

  const [DOB, setDOB] = useState<string | null>(profile?.DOB || "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDOB(value);
  };

  const handleUpdateDOB = async () => {
    try {
      const response = await fetch("/api/user/profile/DOB", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ DOB }),
      });

      const data = await response.json();

      dispatch(updateDOB(data.DOB));

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
          DOB
        </Text>
        <Box width="100%" display={"flex"} justifyContent={"space-between"}>
          <Input type="date" width={"85%"} onChange={handleChange} />
          <Button onClick={handleUpdateDOB}>Submit</Button>
        </Box>
      </Box>
    </>
  );
};

export default EditDOB;
