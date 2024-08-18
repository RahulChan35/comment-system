import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useState, useRef } from "react";
import { db, storage } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useGlobalContext } from "../context";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import UsersModal from "./UsersModal";

const PostComment = () => {
  const {
    currentUser,
    setComments,
    isCommentAdded,
    setIsCommentAdded,
    signedInUsers
  } = useGlobalContext();
  const [comment, setComment] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const editorRef = useRef(null);
  const [showSignedInUsersModal, setShowSignedInUsersModal] = useState(false);
  const maxCommentLength = 250;

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const commentsRef = collection(db, "comments");

  const postComment = () => {
    if (currentUser && comment) {
      let newComment = "";
      if (selectedImage) {
        const storageRef = ref(storage, `images/${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.error("Upload failed", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                newComment = {
                  text: comment,
                  userName: currentUser.displayName,
                  userPhoto: currentUser.photoURL,
                  createdAt: serverTimestamp(),
                  thumbsUp: 0,
                  heart: 0,
                  thumbsDown: 0,
                  attachedImages: downloadURL,
                  replies: []
                };

                addDoc(commentsRef, newComment).then(() => {
                  setSelectedFile("");
                  setSelectedImage("");
                  setComments((previousComments) => {
                    setComment("");
                    setIsCommentAdded(!isCommentAdded);
                    return [...previousComments, newComment];
                  });
                });
              }
            );
          }
        );
      } else {
        newComment = {
          text: comment,
          userName: currentUser.displayName,
          userPhoto: currentUser.photoURL,
          createdAt: serverTimestamp(),
          thumbsUp: 0,
          heart: 0,
          thumbsDown: 0,
          attachedImages: "",
          replies: []
        };
        addDoc(commentsRef, newComment).then(() => {
          setComments((previousComments) => {
            setComment("");
            setIsCommentAdded(!isCommentAdded);
            return [...previousComments, newComment];
          });
        });
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleCommentEdit = (e) => {
    e.preventDefault();
    const inputValue = e.target.value;

    if (inputValue.length <= maxCommentLength) {
      setComment(inputValue);
      setWordCount(inputValue.length);
    } else {
      toast.error("Comment length should not be more than 250", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    }
  };

  const handleUserTagging = (e) => {
    const inputValue = e.target.value;
    if (inputValue[inputValue.length - 1] === "@") {
      setShowSignedInUsersModal(true);
    } else {
      setShowSignedInUsersModal(false);
    }
  };

  const setTagUser = (user) => {
    const { displayName } = user;
    setComment((previousComment) => previousComment + displayName);
  };

  const handleCommentInput = (e) => {
    handleCommentEdit(e);
    handleUserTagging(e);
  };

  return (
    <div className="w-full flex flex-col justify-between mt-10 border-2 border-gray-300 rounded-lg p-3">
      <div className="border-b border-black">
        <div className="w-full flex flex-col">
          <textarea
            type="text"
            placeholder="write some comment"
            className="outline-none w-full h-16 "
            value={comment}
            onInput={(e) => {
              currentUser
                ? handleCommentInput(e)
                : toast.error("Please login to add a comment!", {
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
            ref={editorRef}
          />
        </div>
        {showSignedInUsersModal && (
          <UsersModal
            signedInUsers={signedInUsers}
            setTagUser={setTagUser}
            showSignedInUsersModal={showSignedInUsersModal}
            setShowSignedInUsersModal={setShowSignedInUsersModal}
          />
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {selectedImage && (
          <div>
            <img src={selectedImage} alt="Selected" className="w-1/3 h-1/3" />
          </div>
        )}
      </div>
      <div>
        <h1>{wordCount}/250</h1>
      </div>
      <div className="w-full flex justify-between mt-5">
        <div className="flex justify-between w-32">
          <h1 className="cursor-pointer">
            <FormatBoldIcon
              onClick={() => {
                setIsBold(!isBold);
              }}
            />
          </h1>
          <h1 className="cursor-pointer">
            <FormatItalicIcon />
          </h1>
          <h1 className="cursor-pointer">
            <FormatUnderlinedIcon />
          </h1>
          <h1>
            <AttachFileIcon
              className="cursor-pointer"
              onClick={() => {
                currentUser
                  ? handleFileInputClick()
                  : toast.error("Please login to attach files", {
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
          </h1>
        </div>
        <button
          className="bg-black text-bold text-white p-2 rounded-md"
          onClick={() => {
            currentUser
              ? postComment()
              : toast.error("Please login to add a comment!", {
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
          send
        </button>
      </div>
    </div>
  );
};
export default PostComment;
