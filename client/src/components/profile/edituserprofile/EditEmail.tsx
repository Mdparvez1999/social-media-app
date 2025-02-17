import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { ChangeEvent, useState } from "react";
import { updateEmail } from "../../../redux-store/features/profile/profileSlice";
import { toast } from "react-toastify";

const EditEmail = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);

  const [email, setEmail] = useState<string>(profile?.email || "");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleUpdateEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/user/profile/email`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      dispatch(updateEmail(data.email));

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
        Email
      </Text>
      <Box
        width="100%"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Input
          width={{ xs: "70%", md: "85%" }}
          type="email"
          placeholder={profile?.email || "Add email"}
          value={email}
          onChange={handleChange}
        />
        <Button onClick={handleUpdateEmail} isLoading={loading}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default EditEmail;
