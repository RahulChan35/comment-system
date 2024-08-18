/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const TimeFrame = ({ timestamp }) => {
  const [timeFrame, setTimeFrame] = useState("");

  useEffect(() => {
    const convertToTimeFrame = () => {
      const timeInMillis =
        timestamp?.seconds * 1000 + timestamp?.nanoseconds / 1000000;

      const currentTimeInMillis = Date.now();

      let diffInMillis = currentTimeInMillis - timeInMillis;

      const seconds = Math.floor((diffInMillis / 1000) % 60);
      const minutes = Math.floor((diffInMillis / (1000 * 60)) % 60);
      const hours = Math.floor((diffInMillis / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));

      let timeFrameString = "";
      if (days > 0) timeFrameString += `${days} day${days > 1 ? "s" : ""}, `;
      if (hours > 0) timeFrameString += `${hours} hr${hours > 1 ? "s" : ""}, `;
      if (minutes > 0)
        timeFrameString += `${minutes} min${minutes > 1 ? "s" : ""}, `;
      if (seconds > 0)
        timeFrameString += `${seconds} sec${seconds > 1 ? "s" : ""}`;

      timeFrameString = timeFrameString.trim().replace(/,\s*$/, "");

      setTimeFrame(timeFrameString);
    };

    convertToTimeFrame();
  }, [timestamp]);

  return (
    <div className="ml-3 pl-3 border-l border-gray-300 font-semibold text-gray-400 text-sm">
      {timeFrame || "just now"}
    </div>
  );
};

export default TimeFrame;
