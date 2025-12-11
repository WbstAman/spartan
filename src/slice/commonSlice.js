import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  screenSize: {
    screenWidth: typeof window !== "undefined" ? window.innerWidth : null,
    screenHeight: typeof window !== "undefined" ? window.innerHeight : null,
  },

  betAmount: 0,
  cashOutAt: 2,
  score: [],
  profit: 0,
  difficulty: "easy",
  isCashOut: false,
  initiateGame: "ideal", // "ideal" | "playing" | "won" | "lost"
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
    setInitiateGame: (state, action) => {
      state.initiateGame = action.payload;
    },
    setBetAmount: (state, action) => {
      state.betAmount = action.payload;
    },
    setCashOutAt: (state, action) => {
      state.cashOutAt = action.payload;
    },

    setIsCashOutAt: (state, action) => {
      state.isCashOut = action.payload;
    },
  },
});

export const {
  setScreenSize,
  setDifficulty,
  setBetAmount,
  setCashOutAt,
  setIsCashOutAt,
  setInitiateGame,
} = commonSlice.actions;
export default commonSlice.reducer;
