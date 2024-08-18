/* eslint-disable react/prop-types */
const UsersModal = ({
  signedInUsers,
  setTagUser,
  showSignedInUsersModal,
  setShowSignedInUsersModal
}) => {
  return (
    <div className="flex flex-col rounded-md mt-2 mb-2">
      {signedInUsers.length > 0 &&
        signedInUsers.map((user, index) => {
          const { photoURL, displayName } = user;
          return (
            <div
              key={index}
              className="flex p-1 cursor-pointer hover:bg-gray-200 rounded-md"
              onClick={() => {
                setShowSignedInUsersModal(!showSignedInUsersModal);
                setTagUser(user);
              }}
            >
              <img
                src={photoURL}
                alt={displayName}
                className="w-5 h-5 rounded-full"
              />
              <h1 className="ml-3">{displayName}</h1>
            </div>
          );
        })}
    </div>
  );
};
export default UsersModal;
