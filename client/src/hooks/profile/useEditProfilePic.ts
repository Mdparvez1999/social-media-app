import { sanitizeFileName } from "../../utils/sanitizeFileName";

const useEditProfilePic = () => {
  const editProfilePic = async (profilePic: FormData) => {
    const profilePicFile = profilePic.get("profilePic");

    const profilePicData = {
      name: sanitizeFileName((profilePicFile as File).name),
      type: (profilePicFile as File).type.split("/").pop(),
    };

    const preSignedUrl = await fetch(
      "/api/aws-s3/create-put-object-url-profile-pic",
      {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profilePicData),
      }
    );

    const preSignedUrlData = await preSignedUrl.json();

    if (!preSignedUrlData) {
      throw new Error("something went wrong");
    }

    const uploadResponse = await fetch(preSignedUrlData.data.presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": (profilePicFile as File).type,
      },
      body: profilePicFile,
    });

    if (!uploadResponse.ok) {
      throw new Error("something went wrong");
    }

    const editProfilePicResponse = await fetch("/api/user/profile/profilePic", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profilePic: preSignedUrlData.data.key,
      }),
    });

    const editProfilePicData = await editProfilePicResponse.json();

    if (!editProfilePicData) {
      throw new Error("something went wrong");
    }

    return editProfilePicData;
  };

  return {
    editProfilePic,
  };
};

export default useEditProfilePic;
