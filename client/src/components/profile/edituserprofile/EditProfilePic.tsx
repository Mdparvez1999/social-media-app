import { Avatar, Box, Button, Heading, Input, Spinner } from "@chakra-ui/react";
import { ChangeEvent, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { updateProfilePic } from "../../../redux-store/features/profile/profileSlice";
import { toast } from "react-toastify";

const EditProfilePic = () => {
  const profile = useAppSelector((state) => state.profile.profile);

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selectedProfilePic = e.target.files[0];
      const fileType = selectedProfilePic.type.split("/")[1];

      if (fileType !== "jpeg" && fileType !== "png" && fileType !== "jpg") {
        toast.error("Only JPEG, PNG, and JPG files are allowed.");
        return;
      }

      setLoading(true);
      await updateProfilePicture(selectedProfilePic);
      setLoading(false);
    }
  };

  const updateProfilePicture = async (profilePic: File | null) => {
    try {
      if (profilePic) {
        const formData = new FormData();
        formData.append("profilePic", profilePic);

        const response = await fetch("/api/user/profile/profilePic", {
          method: "PATCH",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();

        if (data.status === "fail" || data.status === "error")
          throw new Error(data.message);

        dispatch(updateProfilePic(data.profilePic));

        toast.success(data.message);
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Box
        border={"1px solid #f2f2f2"}
        width={{ xs: "92%", md: "90%" }}
        borderRadius={"10px"}
        boxShadow={"4px 4px 6px #ccc"}
        p={{ xs: "10px 8px ", md: "10px 20px" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box display={"flex"} alignItems={"center"} gap={"12px"}>
          <Avatar
            size={"md"}
            crossOrigin="anonymous"
            src={
              profile?.profilePic
                ? `http://localhost:8000/uploads/profilePic/${profile?.profilePic}`
                : undefined
            }
            name={profile?.userName}
          />
          <Heading fontSize={"1.2rem"} fontWeight={"500"}>
            {profile?.userName}
          </Heading>
        </Box>
        <Box>
          <Button onClick={fileInputClick}>
            {loading ? <Spinner size="sm" /> : "Change Photo"}
            <Input
              type="file"
              ref={fileInputRef}
              display={"none"}
              name="profilePic"
              onChange={handleFileInputChange}
            />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default EditProfilePic;
