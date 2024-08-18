/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "./config/firebase";
import { getDocs, collection } from "firebase/firestore";

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

const AppContext = (props) => {
  const [currentUser, setCurrentUser] = useState();
  const [signedInUsers, setSignedInUsers] = useState([]);
  const [comments, setComments] = useState();
  const [isCommentAdded, setIsCommentAdded] = useState(false);
  const [isReplyAdded, setIsReplyAdded] = useState(false);
  const [noOfComments, setNoOfComments] = useState(0);

  const commentsRef = collection(db, "comments");

  useEffect(() => {
    async function fetchData() {
      const response = await getDocs(commentsRef);
      const filteredData = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setComments(() => {
        const sortedComments = filteredData.sort((a, b) => {
          return a?.createdAt?.seconds - b?.createdAt?.seconds;
        });
        return [...sortedComments];
      });
      setNoOfComments(response.size);
    }
    fetchData();
  }, [isCommentAdded, isReplyAdded]);

  const sortByLatestComments = () => {
    setComments((previousComments) => {
      const sortedComments = previousComments.sort((a, b) => {
        return b?.createdAt?.seconds - a?.createdAt?.seconds;
      });
      return [...sortedComments];
    });
  };

  const sortByPopularity = () => {
    setComments((previousComments) => {
      const sortedComments = previousComments.sort((a, b) => {
        const totalReactionsA =
          (a?.thumbsUp || 0) + (a?.heart || 0) + (a?.thumbsDown || 0);
        const totalReactionsB =
          (b?.thumbsUp || 0) + (b?.heart || 0) + (b?.thumbsDown || 0);
        return totalReactionsB - totalReactionsA;
      });
      return [...sortedComments];
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        signedInUsers,
        setSignedInUsers,
        comments,
        setComments,
        isCommentAdded,
        setIsCommentAdded,
        isReplyAdded,
        setIsReplyAdded,
        noOfComments,
        setNoOfComments,
        sortByLatestComments,
        sortByPopularity
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default AppContext;
