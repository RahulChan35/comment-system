/* eslint-disable react/prop-types */
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { useGlobalContext } from "../context";
import { useState } from "react";
import { db } from "../config/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const Reply = ({ id, toggleReply }) => {
  const { currentUser, isReplyAdded, setIsReplyAdded } = useGlobalContext();
  const [reply, setReply] = useState("");

  const addReply = async () => {
    if (currentUser && reply) {
      const newReply = {
        text: reply,
        userName: currentUser.displayName,
        userPhoto: currentUser.photoURL,
        thumbsUp: 0,
        heart: 0,
        thumbsDown: 0
      };

      const commentDocRef = doc(db, "comments", id);

      updateDoc(commentDocRef, {
        replies: arrayUnion(newReply)
      }).then(() => {
        setIsReplyAdded(!isReplyAdded);
      });
    }
  };

  return (
    <div className="w-full flex flex-col justify-between mt-10 border-2 border-gray-300 rounded-lg p-3">
      <div className="border-b">
        <div className="w-full flex flex-col">
          <textarea
            placeholder="Reply"
            className="outline-none w-full h-16 "
            value={reply}
            onInput={(e) => setReply(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="w-full flex justify-between mt-5">
        <div className="flex justify-between w-32">
          <h1 className="cursor-pointer">
            <FormatBoldIcon />
          </h1>
          <h1 className="cursor-pointer">
            <FormatItalicIcon />
          </h1>
          <h1 className="cursor-pointer">
            <FormatUnderlinedIcon />
          </h1>
        </div>
        <div className="sm:w-1/2 md:w-1/4 flex justify-between">
          <button
            className="bg-gray-300 sm:w-12 sm:text-xs text-bold border-black p-2 rounded-md"
            onClick={() => {
              toggleReply();
            }}
          >
            Cancel
          </button>
          <button
            className="bg-black sm:w-12 sm:text-xs text-bold text-white p-2 rounded-md"
            onClick={() => {
              addReply();
              toggleReply();
            }}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
};
export default Reply;
