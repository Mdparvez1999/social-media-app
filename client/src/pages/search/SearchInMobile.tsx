import { Avatar, Box, Button, Divider, Input, Text } from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useState } from "react";
import { setUsers } from "../../redux-store/features/users/userSlice";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const SearchInMobile = () => {
  const dispatch = useAppDispatch();

  const searchedUsers = useAppSelector((state) => state.users.users);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [searchResultVisible, setSearchResultVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSearchClick = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/search?userName=${searchTerm}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const { data } = await response.json();

      dispatch(setUsers(data));

      setSearchResultVisible(true);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();

  const navigate = useNavigate();

  const handleClickBack = () => {
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  const handleViewUserProfile = async (userId: string) => {
    try {
      navigate(`/app/selectedUserProfile/${userId}`);
      //   window.location.reload();
      setSearchResultVisible(false);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"} gap={"25px"} p={"10px"}>
        <Button onClick={handleClickBack}>
          <IoArrowBack />
        </Button>
        <Text fontSize={"1.5rem"} fontWeight={"bold"}>
          Search
        </Text>
      </Box>
      <Box display={"flex"} alignItems={"center"} gap={"15px"} padding={"10px"}>
        <Input onChange={(e) => setSearchTerm(e.target.value)} />
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
                  src={
                    user.profilePic
                      ? `http://localhost:8000/uploads/profilePic/${user.profilePic}`
                      : undefined
                  }
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
            pt={"50px"}
          >
            Search anyone with username
          </Box>
        )}
      </Box>{" "}
    </>
  );
};

export default SearchInMobile;
