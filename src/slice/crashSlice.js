import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CRASH_CONFIG } from "../config/crashConfig";
import toast from "react-hot-toast";

let wsRef = null;
let sessionTokenRef = "";
let bettingTimerRef = null;
window.__LAST_KNOWN_WIN_AMOUNT = null;

const initialState = {
  value: 0,
  betAmount: 0,
  cashOutAt: 2,
  score: [],
  profit: 0,
  currentScore: 2,

  balance: "0.00",
  multiplier: 1.0,
  gameState: "loading",
  history: [],
  countdown: 0,
  hasBet: false,
  currentBet: null,
  autoCashout: "2.00",

  multiplierRef: 1.0,
  gameStateRef: "loading",

  lastWinAmount: 0,
  lastProfit: 0,
  hasWon: false,

  isAutoBetting: false,
  autoBetCount: 0,
  autoBetTarget: null,
  pendingBetAmount: 0,

  currentRoundWinners: [],
  winners: [],

  profitLocked: null,
};

export const initGame = createAsyncThunk(
  "crash/initGame",
  async (_, { dispatch }) => {
    if (wsRef?.readyState === WebSocket.OPEN) return;

    try {
      const sessionRes = await fetch(
        `${CRASH_CONFIG.BASE_URL}/get_session_id?sessionId=${CRASH_CONFIG.GAME_TOKEN}`
      );
      let freshToken = await sessionRes.text();
      freshToken = freshToken.trim().replace(/^"|"$/g, "");
      if (!freshToken) throw new Error("Invalid token");

      const joinRes = await fetch(
        `${CRASH_CONFIG.BASE_URL}/join/${CRASH_CONFIG.GAME_SLUG}/`,
        {
          headers: {
            "X-CASINOTV-TOKEN": freshToken,
            "X-CASINOTV-PROTOCOL-VERSION": "1.1",
          },
        }
      );
      const joinData = await joinRes.json();
      if (!joinData.IsSuccess) throw new Error(joinData.Message);

      window.__CRASH_INSTANCE_ID =
        joinData.ResponseData?.GameIds?.[0] || "CrashMarketAuto";

      sessionTokenRef = freshToken;
      dispatch(connectWebSocket());
    } catch (err) {
      setTimeout(() => dispatch(initGame()), 1000);
    }
  }
);

export const connectWebSocket = createAsyncThunk(
  "crash/connectWebSocket",
  async (_, { dispatch, getState }) => {
    if (wsRef?.readyState === WebSocket.OPEN) return;

    const socket = new WebSocket(CRASH_CONFIG.WS_URL);
    wsRef = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "init",
          instanceId: window.__CRASH_INSTANCE_ID || `${CRASH_CONFIG.GAME_SLUG}`,
          sessionToken: sessionTokenRef,
          wrapMessages: false,
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const wrapper = JSON.parse(event.data);
        if (wrapper.type !== "message") return;
        let raw = wrapper.data.Message;
        if (typeof raw === "string") raw = JSON.parse(raw);

        const type = raw.type;
        const data = raw.message || raw;

        // console.log("type: ", type);
        // console.log("data: ", data);

        if (type === "user" || type === "balance") {
          const bal = data.balance ?? data;
          if (bal) dispatch(setBalance(parseFloat(bal).toFixed(8)));
        }

        if (type === "history") {
          const rounds = data.data || data.rounds || [];
          const crashes = rounds
            .map((round) => {
              const point =
                round.result || round.crashPoint || round.multiplier;
              return point ? parseFloat(point).toFixed(2) : null;
            })
            .filter(Boolean)
            .reverse()
            .slice(0, 20);
          dispatch(setHistory(crashes));
          return;
        }

        if (type === "bets_registered") {
          if (data.bets && data.bets.length > 0) {
            const bet = data.bets[0];
            const amount = parseFloat(bet.amount);
            dispatch(setHasBet(true));
            dispatch(setCurrentBet(amount));
            dispatch({ type: "crash/setPendingBetAmount", payload: amount });
            console.log("BET CONFIRMED:", bet);
          }
        }

        if (type === "round_stats" && Array.isArray(data.winners)) {
          // console.log("CURRENT ROUND WINNERS:", data.winners);

          // console.log("type: ", type);
          // console.log("data: ", data);

          const winners = data.winners.map((w) => ({
            nick: w.nick || w.user || "Unknown",
            amount: parseFloat(w.amount || w.winAmount || 0).toFixed(2),
            currency: w.currency || "€",
            winData: w.winData || "-",
            time: new Date().toLocaleTimeString().slice(0, 8),
            highlight: w.nick !== "HOUSE" && w.nick !== "House",
          }));

          dispatch(setCurrentRoundWinners(winners));
        }

        if (type === "current_status" || type === "status") {
          const status = data.status;
          if (status === 1 || status === "WaitingForBets") {
            dispatch(setGameStateSafe("betting"));
            dispatch(setHasBet(false));
            dispatch(setCurrentBet(null));
            dispatch(setMultiplierSafe(1.0));
            dispatch(clearCurrentRoundWinners());
            dispatch(resetProfitLock());
            const bettingSeconds = data.length + 1 || 8;
            dispatch(setCountdown(bettingSeconds));

            if (bettingTimerRef) clearInterval(bettingTimerRef);
            let timeLeft = bettingSeconds;
            bettingTimerRef = setInterval(() => {
              timeLeft--;
              dispatch(setCountdown(timeLeft));
              if (timeLeft <= 0) clearInterval(bettingTimerRef);
            }, 1000);
          } else if (status === 0 || status === "InProgress") {
            dispatch(setGameStateSafe("flying"));
          } else if (status === 3 && data.result) {
            const crashVal = parseFloat(data.result).toFixed(2);
            dispatch(setMultiplierSafe(parseFloat(crashVal)));
            dispatch(addToHistory(crashVal));
            dispatch(setGameStateSafe("crashed"));
            setTimeout(() => {
              dispatch(setGameStateSafe("loading"));
              // dispatch(setMultiplierSafe(1.0));
            }, 1000);
          }
        } else if (data.status === 3 && data.result) {
          const crashVal = parseFloat(data.result).toFixed(2);
          dispatch(setMultiplierSafe(parseFloat(crashVal)));
          dispatch(addToHistory(crashVal));
          dispatch(setGameStateSafe("crashed"));

          const state = getState().crash;
          if (state.hasBet) {
            console.log("BUSTED! (Detected loss on crash without cashout)");
            console.log(`Bet Amount: ${state.currentBet.toFixed(2)}`);
            console.log(`Crashed at: ${crashVal}x`);
            console.log(`Lost: -${state.currentBet.toFixed(2)}`);

            dispatch(resetWin());
            dispatch(setHasBet(false));
          }

          setTimeout(() => {
            dispatch(setGameStateSafe("loading"));
            // dispatch(setMultiplierSafe(1.0));
          }, 1000);
        } else if (type === "crash_update" || type === undefined) {
          const state = getState().crash;

          const m =
            data.multiplier !== undefined && data.multiplier !== null
              ? parseFloat(data.multiplier)
              : state.multiplier;

          dispatch(setMultiplierSafe(m));

          if (state.gameStateRef === "betting" && m > 1.01) {
            dispatch(setGameStateSafe("flying"));
            dispatch(setCountdown(0));
          }

          if (data.status === "Won" && data.winAmount && state.hasBet) {
            const winAmount = parseFloat(data.winAmount);
            const betAmount = state.currentBet || state.pendingBetAmount || 0;
            const realProfit = (winAmount - betAmount).toFixed(2);

            dispatch(lockProfit(realProfit));

            window.__LAST_KNOWN_WIN_AMOUNT = winAmount;
            toast.success(`Cashed out! +${realProfit} USDT`);
          }

          if (
            data.status === "Lost" &&
            state.hasBet &&
            !window.__LAST_KNOWN_WIN_AMOUNT
          ) {
            const betAmount = state.pendingBetAmount || state.currentBet || 0;

            console.log("BUSTED! (Lost everything)");
            console.log(`Bet Amount: ${betAmount.toFixed(2)}`);
            console.log(`Crashed at: ${m.toFixed(2)}x`);

            dispatch(resetWin());
            dispatch(setHasBet(false));
            dispatch(setCurrentBet(null));
            dispatch(setPendingBetAmount(0));
            window.__LAST_KNOWN_WIN_AMOUNT = null;

            dispatch(lockProfit("0.00"));
          }
        }

        if (
          wrapper.type === "message" &&
          raw.name === "Winners" &&
          Array.isArray(raw.items)
        ) {
          // console.log("wrapper: ", wrapper);
          const winners = raw.items.map((item) => ({
            nick: item.nick,
            amount: parseFloat(item.amount).toFixed(2),
            currency: item.currency || "€",
            winData: item.winData || "-",
            time: item.date.split(" ")[1].slice(0, 8),
            highlight: item.nick !== "HOUSE",
          }));

          dispatch(setWinners(winners.slice(0, 20).reverse()));
        }

        if (type === "shutdown") {
          // console.log("shutdown");
          socket.close();
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    socket.onclose = () => {
      wsRef = null;
      setTimeout(() => dispatch(connectWebSocket()), 1000);
    };
  }
);

const postAction = createAsyncThunk(
  "crash/post",
  async (payload, { dispatch }) => {
    const send = async (token) => {
      const res = await fetch(
        `${CRASH_CONFIG.BASE_URL}/post/${CRASH_CONFIG.GAME_SLUG}/`,
        {
          method: "POST",
          headers: {
            "X-CASINOTV-TOKEN": token,
            "X-CASINOTV-PROTOCOL-VERSION": "1.1",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      return res.json();
    };

    let json = await send(sessionTokenRef);
    console.log("=== BET API RESPONSE ===", json);
    if (json.ErrorCode === 401 || json.Message?.includes("token")) {
      const fresh = await fetch(
        `${CRASH_CONFIG.BASE_URL}/get_session_id?sessionId=${CRASH_CONFIG.GAME_TOKEN}`
      );
      const newToken = (await fresh.text()).trim().replace(/"/g, "");
      sessionTokenRef = newToken;
      json = await send(newToken);
    }

    if (!json.IsSuccess) throw new Error(json.ErrorMessage || "Request failed");
    return json.ResponseData;
  }
);

export const placeBet = createAsyncThunk(
  "crash/placeBet",
  async ({ amount, autoCashoutMultiplier }, { getState, dispatch }) => {
    const state = getState().crash;
    if (state.hasBet || !["betting", "loading"].includes(state.gameState)) {
      return;
    }

    const betAmount = parseFloat(amount);
    if (betAmount < 0.01) {
      toast.error("Minimum bet is 0.01");
      return;
    }

    dispatch(setCurrentBet(betAmount));

    const payload = {
      type: "bet",
      amount: betAmount.toFixed(8),
      betInfo: {
        id: 4,
        title: { key: "straight", value: {} },
        type: "straight",
        items: [],
        rate: 5,
        state: "Active",
      },
    };

    if (autoCashoutMultiplier && parseFloat(autoCashoutMultiplier) >= 1.01) {
      payload.multiplier = parseFloat(autoCashoutMultiplier);
    }

    console.log("PLACING BET →", payload);

    try {
      const result = await dispatch(postAction(payload)).unwrap();

      if (result?.registeredBets?.length > 0) {
        toast.success(`Bet placed: ${betAmount.toFixed(2)} USDT`);
        return;
      }

      if (result?.error === "LIMIT_REACHED") {
        console.warn("Bet rejected: LIMIT_REACHED");
        dispatch(setHasBet(false));
        dispatch(setCurrentBet(null));

        toast.error("Bet limit reached, try again.");
        return;
      }

      throw new Error(result?.error || "Unknown bet rejection");
    } catch (err) {
      console.error("Bet failed:", err);
      toast.error("Bet failed: " + (err.message || "Server rejected"));
      dispatch(setCurrentBet(null));
    }
  }
);

export const cashout = createAsyncThunk(
  "crash/cashout",
  async (_, { getState, dispatch }) => {
    const state = getState().crash;
    if (!state.hasBet || state.gameState !== "flying") return;

    try {
      const responseData = await dispatch(postAction({ type: "cashout" })).unwrap();

      if (responseData?.state?.status === "Won") {
        const winAmount = parseFloat(responseData.state.winAmount);
        const betAmount = state.currentBet || state.pendingBetAmount || 0;
        const realProfit = (winAmount - betAmount).toFixed(2);
        const currentMultiplier = state.multiplier.toFixed(2); // Capture exact moment

        dispatch(lockProfit(realProfit));

        return {
          success: true,
          profit: realProfit,
          multiplier: currentMultiplier,
        };
      }
    } catch (err) {
      toast.error("Cashout failed!");
      throw err; // Let component know it failed
    }
  }
);

export const startAutoPlay = createAsyncThunk(
  "crash/startAutoPlay",
  async ({ amount, multiplier, difficulty = 0 }, { dispatch, getState }) => {
    const payload = {
      type: "autoplay",
      amount: parseFloat(amount).toFixed(8),
      multiplier: parseFloat(multiplier),
      difficulty: difficulty,
    };

    console.log("STARTING AUTOPLAY →", payload);

    try {
      await dispatch(postAction(payload)).unwrap();
      dispatch(setIsAutoBetting(true));
      toast.success("Auto-bet started!");
    } catch (err) {
      console.error("Autoplay failed:", err);
      toast.error("Failed to start auto bet");
      dispatch(setIsAutoBetting(false));
    }
  }
);

export const stopAutoPlay = createAsyncThunk(
  "crash/stopAutoPlay",
  async (_, { dispatch }) => {
    try {
      await dispatch(postAction({ type: "stop_autoplay" })).unwrap();
      dispatch(setIsAutoBetting(false));
    } catch (err) {
      console.error("Stop autoplay failed:", err);
    }
  }
);

const crashSlice = createSlice({
  name: "crash",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    setBetAmount: (state, action) => {
      state.betAmount = action.payload;
    },
    setCashOutAt: (state, action) => {
      state.cashOutAt = action.payload;
    },
    addScore: (state, action) => {
      state.score.unshift(action.payload);
      state.score = state.score.slice(0, 10).reverse();
    },
    setProfit: (state, action) => {
      state.profit = action.payload;
    },
    setCurrentScore: (state, action) => {
      state.currentScore = action.payload;
    },

    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setMultiplierSafe: (state, action) => {
      state.multiplier = action.payload;
      state.multiplierRef = action.payload;
    },
    setGameStateSafe: (state, action) => {
      state.gameState = action.payload;
      state.gameStateRef = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setCountdown: (state, action) => {
      state.countdown = action.payload;
    },
    setHasBet: (state, action) => {
      state.hasBet = action.payload;
    },
    setCurrentBet: (state, action) => {
      state.currentBet = action.payload;
    },
    setAutoCashout: (state, action) => {
      state.autoCashout = action.payload;
    },

    addToHistory: (state, action) => {
      const crashVal = action.payload;
      state.history = [crashVal, ...state.history.slice(0, 19)];
    },
    setLastWin: (state, action) => {
      const winAmount = action.payload;
      state.lastWinAmount = winAmount;
      const originalBet = state.pendingBetAmount || state.currentBet || 0;
      state.lastProfit = (winAmount - originalBet).toFixed(2);
      state.hasWon = true;
    },
    resetWin: (state) => {
      state.lastWinAmount = 0;
      state.lastProfit = 0;
      state.hasWon = false;
    },
    setIsAutoBetting: (state, action) => {
      state.isAutoBetting = action.payload;
    },
    setAutoBetTarget: (state, action) => {
      state.autoBetTarget = action.payload;
    },
    setPendingBetAmount: (state, action) => {
      state.pendingBetAmount = action.payload;
    },
    setWinners: (state, action) => {
      state.winners = action.payload;
      state.winnersLoading = false;
    },
    setCurrentRoundWinners: (state, action) => {
      state.currentRoundWinners = action.payload;
    },
    clearCurrentRoundWinners: (state) => {
      state.currentRoundWinners = [];
    },
    lockProfit: (state, action) => {
      state.profitLocked = action.payload;
    },
    resetProfitLock: (state) => {
      state.profitLocked = null;
    },
  },
});

export const {
  increment,
  setBetAmount,
  setCashOutAt,
  addScore,
  setProfit,
  setCurrentScore,
  setBalance,
  setMultiplierSafe,
  setGameStateSafe,
  setHistory,
  setCountdown,
  setHasBet,
  setCurrentBet,
  setAutoCashout,
  addToHistory,
  setLastWin,
  resetWin,
  isAutoBetting,
  setAutoBetTarget,
  setIsAutoBetting,
  setPendingBetAmount,
  setWinners,
  setCurrentRoundWinners,
  clearCurrentRoundWinners,
  resetProfitLock,
  lockProfit,
} = crashSlice.actions;

export default crashSlice.reducer;
