import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { updateDOB } from "../../../redux-store/features/profile/profileSlice";

const EditDOB = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);

  const [DOB, setDOB] = useState<string | null>(profile?.DOB || "");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDOB(value);
  };

  const handleUpdateDOB = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/user/profile/DOB`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ DOB }),
        }
      );

      const data = await response.json();

      dispatch(updateDOB(data.DOB));

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
        DOB
      </Text>
      <Box width="100%" display={"flex"} justifyContent={"space-between"}>
        <Input
          type="date"
          width={{ xs: "70%", md: "85%" }}
          onChange={handleChange}
        />
        <Button onClick={handleUpdateDOB} isLoading={loading}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default EditDOB;
