import { useState } from "react";
import useMessageCenter from "./useMessageCenter";
import useNavigation from "./useNavigation";

const useDetectEmptyData = (message, data, cond, destinationOnEmptyData) => {
  const [open, setOpen] = useState(true);
  const onMessageCenterCloseCallback = () => {
    setOpen(false);
  };
  useMessageCenter(message, cond, onMessageCenterCloseCallback);
  useNavigation(destinationOnEmptyData, open === false);
};

export default useDetectEmptyData;