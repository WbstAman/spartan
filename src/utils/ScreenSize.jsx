import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setScreenSize } from "../slice/commonSlice";

export const ScreenSize = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      dispatch(
        setScreenSize({
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
        })
      );
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

};

export default ScreenSize