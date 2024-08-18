/* eslint-disable react/prop-types */
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import TimeFrame from "./TimeFrame";
import { useGlobalContext } from "../context";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

const RepliesSection = ({
  id,
  text,
  userName,
  userPhoto,
  createdAt,
  thumbsUp,
  heart,
  thumbsDown,
  attachedImages,
  toggleReply
}) => {
  const { currentUser, comments, setComments } = useGlobalContext();

  const handleThumbsUpClick = (id) => {
    if (currentUser) {
      const newComments = comments.map((comment) => {
        if (comment.id === id) {
          const commentRef = doc(db, "comments", id);

          comment.thumbsUp += 1;
          const newThumbsUpValue = comment.thumbsUp;

          updateDoc(commentRef, {
            thumbsUp: newThumbsUpValue
          });
          return { ...comment };
        }
        return { ...comment };
      });
      setComments(newComments);
    }
  };

  const handleHeartinClick = (id) => {
    if (currentUser) {
      const newComments = comments.map((comment) => {
        if (comment.id === id) {
          const commentRef = doc(db, "comments", id);

          comment.heart += 1;
          const newHeart = comment.heart;

          updateDoc(commentRef, {
            heart: newHeart
          });
        }
        return { ...comment };
      });
      setComments(newComments);
    }
  };

  const handleThumbsDownClick = (id) => {
    if (currentUser) {
      const newComments = comments.map((comment) => {
        if (comment.id === id) {
          const commentRef = doc(db, "comments", id);

          comment.thumbsDown += 1;
          const newThumbsDownValue = comment.thumbsDown;

          updateDoc(commentRef, {
            thumbsDown: newThumbsDownValue
          });
        }
        return { ...comment };
      });
      setComments(newComments);
    }
  };
  return (
    <div className="flex flex-col w-full mt-3 border-2 border-gray-300 rounded-lg p-2">
      <div className="flex items-center">
        <img src={userPhoto} alt={userName} className="w-8 h-8 rounded-full" />
        <h1 className="ml-2">{userName}</h1>
      </div>
      <div className="mt-3 font-semibold text-gray-500 text-justify">
        {text}
      </div>
      <div className="mt-3">
        {attachedImages && (
          <img
            src={attachedImages && attachedImages}
            alt={attachedImages && attachedImages}
            className="w-1/4 h-1/4 rounded-md"
          />
        )}
      </div>
      <div className="flex mt-3 items-center">
        <InsertEmoticonIcon />
        <div className="flex ml-2">
          <ThumbUpOffAltIcon
            onClick={() => {
              handleThumbsUpClick(id);
            }}
          />
          <h1>{thumbsUp}</h1>
        </div>
        <div className="flex ml-2">
          <FavoriteIcon
            onClick={() => {
              handleHeartinClick(id);
            }}
          />
          <h1>{heart}</h1>
        </div>
        <div className="flex ml-2">
          <ThumbDownOffAltIcon
            onClick={() => {
              handleThumbsDownClick(id);
            }}
          />
          <h1>{thumbsDown}</h1>
        </div>
        <div className="ml-3 pl-3 border-l border-gray-300">
          <button
            onClick={() => {
              toggleReply();
            }}
          >
            Reply
          </button>
        </div>
        <TimeFrame timestamp={createdAt} />
      </div>
    </div>
  );
};
export default RepliesSection;
