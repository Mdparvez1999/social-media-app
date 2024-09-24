import { Box, Button, Select, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { updateGender } from "../../../redux-store/features/profile/profileSlice";

const EditGender = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);

  const [gender, setGender] = useState<string>(profile?.gender || "");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value);
  };

  const handleUpdateGender = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/user/profile/gender`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ gender }),
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "fail" || data.status === "error") {
        throw new Error(data.message);
      }

      dispatch(updateGender(data.gender));

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
        Gender
      </Text>
      <Box width="100%" display={"flex"} justifyContent={"space-between"}>
        <Select
          width={{ xs: "70%", md: "85%" }}
          value={gender}
          onChange={handleChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        <Button onClick={handleUpdateGender} isLoading={loading}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default EditGender;
