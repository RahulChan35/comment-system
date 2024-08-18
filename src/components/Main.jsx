import PostComment from "./PostComment";
import Comments from "./Comments";
import { useGlobalContext } from "../context";
import { toast } from "react-toastify";

const Main = () => {
  const { currentUser, noOfComments, sortByLatestComments, sortByPopularity } =
    useGlobalContext();

  return (
    <div className="w-3/4 md:w-1/2 m-auto mt-2 mb-5 border-2 border-gray-300 rounded-lg p-10">
      <div className="w-full flex justify-between items-center">
        <h1 className="font-bold">Comments({noOfComments})</h1>
        <div className="flex flex-col md:flex-row justify-between">
          <h1
            className="p-1 bg-gray-200 sm:rounded-md md:rounded-l-md cursor-pointer border-r border-gray-400"
            onClick={() => {
              currentUser
                ? sortByLatestComments()
                : toast.error("Please login to perform this action!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                  });
            }}
          >
            Latest
          </h1>
          <h1
            className="p-1 bg-gray-200 sm:rounded-md md:rounded-r-md cursor-pointer"
            onClick={() => {
              currentUser
                ? sortByPopularity()
                : toast.error("Please login to perform this action!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                  });
            }}
          >
            Popular
          </h1>
        </div>
      </div>
      <PostComment />
      <Comments />
    </div>
  );
};
export default Main;
