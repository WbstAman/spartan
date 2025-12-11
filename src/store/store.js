import { configureStore } from '@reduxjs/toolkit';
import balloonsReducer from "../slice/balloonsSlice";
import commonSlice from "../slice/commonSlice";
import crashReducer from "../slice/crashSlice";

crashReducer

export const store = configureStore({
  reducer: {
    common:commonSlice,
    crash: crashReducer,
    balloons: balloonsReducer,
  },
});
