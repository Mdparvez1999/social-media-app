import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Text,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useState } from "react";
import {
  setUsers,
  UserState,
} from "../../redux-store/features/users/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useFetchGetObjectUrlForAllProfilePics from "../../hooks/usersprofile/useFetchGetObjectUrlForAllProfilePics";

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const Search = ({ isOpen, onClose }: SearchProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchedUsers = useAppSelector((state) => state.users.users);

  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchResultVisible, setSearchResultVisible] = useState(false);

  const handleSearchClick = async () => {
    if (!searchTerm) {
      toast.error("Please enter a username");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/users/search?userName=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      const searchedUsersData = data.data;

      const uniqueUrls = new Map();

      searchedUsersData.forEach((user: UserState) => {
        const { id: userId, profilePic } = user;

        if (!uniqueUrls.has(userId)) {
          uniqueUrls.set(userId, profilePic);
        }
      });

      const profilePicUrls: string[] | undefined =
        await fetchGetObjectUrlForAllProfilePics([...uniqueUrls.values()]);

      const updatedSearchedUsersData = searchedUsersData.map(
        (user: UserState) => {
          return {
            ...user,
            profilePic: profilePicUrls?.find((url: string) => {
              return url.includes(uniqueUrls.get(user.id));
            }),
          };
        }
      );

      dispatch(setUsers(updatedSearchedUsersData));
      setSearchResultVisible(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setSearchResultVisible(false);
    setSearchTerm("");
    onClose();
  };

  const handleViewUserProfile = (userId: string) => {
    navigate(`/app/usersprofile/${userId}`);
    // window.location.reload();
    setSearchResultVisible(false);
    onClose();
  };

  return (
    <>
      <Drawer isOpen={isOpen} onClose={handleCloseDrawer} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search</DrawerHeader>
          <DrawerBody width={"100%"}>
            <Box display={"flex"} alignItems={"center"} gap={"15px"}>
              <Input
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={handleSearchClick} isLoading={loading}>
                <BiSearch size={30} />
              </Button>
            </Box>
            <Divider my={"15px"} />
            <Box height={"70%"} overflowY={"auto"}>
              {searchResultVisible ? (
                searchedUsers.length > 0 ? (
                  searchedUsers.map((user) => (
                    <Box
                      key={user.id}
                      display={"flex"}
                      alignItems={"center"}
                      gap={"16px"}
                      padding={"10px"}
                      cursor={"pointer"}
                      _hover={{ backgroundColor: "gray.100" }}
                      mb={"10px"}
                      borderRadius={"10px"}
                      onClick={() => handleViewUserProfile(user.id)}
                    >
                      <Avatar
                        crossOrigin="anonymous"
                        src={user.profilePic ? user.profilePic : undefined}
                        name={user.userName}
                      />

                      <Text fontSize={"1.1rem"} fontWeight={"500"}>
                        {user.userName}
                      </Text>
                    </Box>
                  ))
                ) : (
                  <Box minHeight={"100%"} textAlign={"center"}>
                    No users found
                  </Box>
                )
              ) : (
                <Box
                  minHeight={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  Search anyone with username
                </Box>
              )}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Search;
