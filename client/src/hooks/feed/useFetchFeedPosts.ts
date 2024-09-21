import { toast } from "react-toastify";
import { FeedState } from "../../redux-store/features/feed/feedSlice";
import useFetchGetObjectUrlForAllProfilePics from "../usersprofile/useFetchGetObjectUrlForAllProfilePics";
import useFetchGetObjectPresignedUrls from "../post/useFetchGetObjectPresignedUrls";

const useFetchFeedPosts = () => {
  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();

  const { fetchGetObjectPresignedUrls } = useFetchGetObjectPresignedUrls();
  const fetchFeedPosts = async () => {
    try {
      const response = await fetch("/api/users/post/feed", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        return toast.error(data.message);

      const feedData = data.data;

      const uniqueProfilePicUrls = new Map();

      feedData.forEach((post: FeedState) => {
        const { id: userId, profilePic: profilePicUrl } = post.user;

        if (!uniqueProfilePicUrls.has(profilePicUrl)) {
          uniqueProfilePicUrls.set(userId, profilePicUrl);
        }
      });

      const profilePicUrls = await fetchGetObjectUrlForAllProfilePics([
        ...uniqueProfilePicUrls.values(),
      ]);

      const feedPostFiles = feedData.flatMap((post: FeedState) => post.files);

      const postUrls = await fetchGetObjectPresignedUrls(feedPostFiles);

      const updatedFeedPosts = feedData.map((post: FeedState) => ({
        ...post,
        files: post.files.map((file) => {
          const url = postUrls?.find((url: string) => url.includes(file));
          return url;
        }),
        user: {
          ...post.user,
          profilePic: profilePicUrls?.find((url: string) => {
            return url.includes(uniqueProfilePicUrls.get(post.user.id));
          }),
        },
      }));

      return updatedFeedPosts;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return { fetchFeedPosts };
};

export default useFetchFeedPosts;
