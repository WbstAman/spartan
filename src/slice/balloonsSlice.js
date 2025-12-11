import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentIndex: null,
  losingIndex: null,
  lastRandom: null,
  currentScore: 0,
};

export const balloonsSlice = createSlice({
  name: "balloons",
  initialState,
  reducers: {
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },

    setLosingIndex: (state, action) => {
      state.losingIndex = action.payload;
    },

    setLastRandom: (state, action) => {
      state.lastRandom = action.payload;
    },
    setCurrentScore: (state, action) => {
      state.currentScore = action.payload;
    },
  },
});

export const {
  setCurrentIndex,
  setLosingIndex,
  setLastRandom,
  setCurrentScore,
} = balloonsSlice.actions;

export default balloonsSlice.reducer;
