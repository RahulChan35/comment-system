/* eslint-disable react/prop-types */
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import TimeFrame from "./TimeFrame";
import { useGlobalContext } from "../context";
import { db } from "../config/firebase";
import { toast } from "react-toastify";
import { updateDoc, doc } from "firebase/firestore";
import { useState } from "react";
import Reply from "./Reply";
import RepliesSection from "./RepliesSection";

const CommentSection = ({
  id,
  text,
  userName,
  userPhoto,
  thumbsUp,
  heart,
  thumbsDown,
  createdAt,
  attachedImages,
  replies
}) => {
  const { currentUser, comments, setComments, setIsCommentAdded } =
    useGlobalContext();
  const [show, setShow] = useState(true);
  const [isReplyClicked, setIsReplyClicked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const maxShowableCommentLength = 50;

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
      setIsCommentAdded(true);
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
          return { ...comment };
        }
        return { ...comment };
      });
      setComments(newComments);
      setIsCommentAdded(true);
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
          return { ...comment };
        }
        return { ...comment };
      });
      setComments(newComments);
      setIsCommentAdded(true);
    }
  };

  const toggleReply = () => {
    setIsReplyClicked(!isReplyClicked);
  };

  return (
    <div className="flex flex-col w-full mt-8 items-start relative">
      <div className="flex items-center">
        <img src={userPhoto} alt={userName} className="w-8 h-8 rounded-full" />
        <h1 className="ml-2">{userName}</h1>
      </div>
      <div className="w-full mt-3 font-semibold text-gray-500">
        <p>
          {show ? text : `${text.substring(0, maxShowableCommentLength)}...`}
          <span
            className="text-blue-500 text-sm cursor-pointer ml-2"
            onClick={() => setShow(!show)}
          >
            {show ? "Show Less" : "Show More"}
          </span>
        </p>
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
          <div className="flex ml-2 cursor-pointer">
            <ThumbUpOffAltIcon
              onClick={() => {
                currentUser
                  ? handleThumbsUpClick(id)
                  : toast.error("Please login to perform the action!", {
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
            />
            <h1>{thumbsUp}</h1>
          </div>
          <div className="flex ml-2 cursor-pointer">
            <FavoriteIcon
              onClick={() => {
                currentUser
                  ? handleHeartinClick(id)
                  : toast.error("Please login to perform the action", {
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
            />
            <h1>{heart}</h1>
          </div>
          <div className="flex ml-2 cursor-pointer">
            <ThumbDownOffAltIcon
              onClick={() => {
                currentUser
                  ? handleThumbsDownClick(id)
                  : toast.error("Please login to perform the action", {
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
            />
            <h1>{thumbsDown}</h1>
          </div>
          <div className="ml-3 pl-3 border-l border-gray-300">
            <button
              onClick={() => {
                currentUser
                  ? toggleReply()
                  : toast.error("Please login to perform the action", {
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
              Reply
            </button>
          </div>
          <TimeFrame timestamp={createdAt} />
        </div>
        {isReplyClicked && <Reply id={id} toggleReply={toggleReply} />}
        <button
          className="font-semibold text-sm cursor-pointer mt-2 text-gray-500"
          onClick={() =>
            currentUser
              ? setShowReplies(!showReplies)
              : toast.error("Please login to perform this action!", {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light"
                })
          }
        >
          Replies({replies?.length})
        </button>
        <div className="w-full">
          {showReplies &&
            replies?.length > 0 &&
            replies?.map((reply, index) => {
              return (
                <RepliesSection
                  key={index}
                  {...reply}
                  toggleReply={toggleReply}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default CommentSection;
