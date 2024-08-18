import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useGlobalContext } from "../context";
import google_logo from "../assets/google_logo.webp";

const Navbar = () => {
  const { currentUser, setCurrentUser, setSignedInUsers } = useGlobalContext();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (data) => {
        setCurrentUser(data.user);
        setSignedInUsers((previouslySignedInUsers) => {
          const users = previouslySignedInUsers.filter(
            (user) => user.uid === data.user.uid
          );
          if (users.length > 0) {
            return [...previouslySignedInUsers];
          }
          return [...previouslySignedInUsers, data.user];
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };
  return (
    <div className="w-full md:w-1/2 m-auto">
      {currentUser ? (
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center">
            <img
              src={currentUser?.photoURL}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <h1 className="ml-2 text-xl">{currentUser?.displayName}</h1>
          </div>
          <button className="font-bold md:text-xl" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="flex justify-end items-center">
          <img src={google_logo} alt="Google" className="w-8 h-8" />
          <button
            onClick={signInWithGoogle}
            className="bg-white font-bold md:text-xl"
          >
            Sign with the Google
          </button>
        </div>
      )}
    </div>
  );
};
export default Navbar;
