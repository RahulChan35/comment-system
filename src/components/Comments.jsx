import { useGlobalContext } from "../context";
import CommentSection from "./CommentSection";

const Comments = () => {
  const { comments } = useGlobalContext();
  return (
    <div>
      {comments?.map((comment, index) => {
        return (
          <div key={index}>
            <CommentSection {...comment} />
          </div>
        );
      })}
    </div>
  );
};
export default Comments;
