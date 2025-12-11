import React, { useEffect, useMemo, useState } from "react";
import { Tabs } from "../../../UI/Tab/Tabs";
import CustomButton from "../../../UI/Buttons/CustomButton";
import PlayersBetsPanel from "../PlayersBetsPanel/PlayersBetsPanel";
import usdt from "../../../../assets/images/usdt.jpg";
import { tabsMenu } from "../../../../constant";
import InputField from "../../../UI/InputFields/InputField";
import { useSelector, useDispatch } from "react-redux";
import {
  placeBet,
  cashout,
  setAutoCashout,
  startAutoPlay,
  stopAutoPlay,
  lockProfit,
} from "../../../../slice/crashSlice";
import toast from "react-hot-toast";

const CrashSidebar = () => {
  const dispatch = useDispatch();
  const {
    gameState,
    hasBet,
    balance,
    autoCashout,
    isAutoBetting,
    multiplier,
    currentBet,
    profitLocked,
  } = useSelector((state) => state.crash);

  const [betAmount, setBetAmount] = useState("10.00");
  const [autoCashoutAt, setAutoCashoutAt] = useState(autoCashout || "2.00");
  const [manualCashoutProfit, setManualCashoutProfit] = useState(null);

  const [tabs, setTabs] = useState(tabsMenu);
  const [activeTab, setActiveTab] = useState(0);
  const firstAutoRun = React.useRef(true);

  useEffect(() => {
    if (!isAutoBetting) return;

    if (firstAutoRun.current) {
      firstAutoRun.current = false;
      return;
    }

    if (hasBet) return;
    if (gameState !== "betting" && gameState !== "loading") return;

    dispatch(
      placeBet({
        amount: parseFloat(betAmount),
        autoCashoutMultiplier: parseFloat(autoCashoutAt),
      })
    );
  }, [gameState, isAutoBetting, hasBet]);

  useEffect(() => {
    if (autoCashout) setAutoCashoutAt(autoCashout);
  }, [autoCashout]);

  useEffect(() => {
    dispatch(setAutoCashout(autoCashoutAt));
  }, [autoCashoutAt, dispatch]);

  useEffect(() => {
    if (gameState === "betting" || gameState === "loading") {
      setManualCashoutProfit(null);
    }
  }, [gameState]);

  const liveProfit = useMemo(() => {
    if (!hasBet || !currentBet || gameState !== "flying") {
      return "0.00";
    }

    const profit = multiplier * currentBet - currentBet;
    return profit > 0 ? profit.toFixed(2) : "0.00";
  }, [multiplier, hasBet, currentBet, gameState]);

  const displayProfit = useMemo(() => {
    if (profitLocked !== null) return profitLocked;
    if (manualCashoutProfit !== null) return manualCashoutProfit;
    return hasBet ? liveProfit : "0.00";
  }, [profitLocked, manualCashoutProfit, hasBet, liveProfit]);

  const handleBetAmount = (value, action) => {
    let v = String(value);
    if (action === null) {
      if (v.startsWith(".")) v = "0" + v;
      if (v.includes(".")) {
        const [int, dec] = v.split(".");
        v =
          (int.replace(/^0+(?!$)/, "") || "0") + "." + (dec || "").slice(0, 2);
      } else v = v.replace(/^0+(?!$)/, "") || "0";
      setBetAmount(v || "0");
      return;
    }
    const num = parseFloat(betAmount) || 0;
    if (action === "half") setBetAmount((num / 2).toFixed(2));
    if (action === "double") setBetAmount((num * 2).toFixed(2));
  };

  const handleCashoutAt = (value, action) => {
    const isButtonClick = value === null || value === undefined;

    if (isButtonClick) {
      const current = parseFloat(autoCashoutAt) || 2.0;
      if (action === "inc") {
        setAutoCashoutAt((current + 0.1).toFixed(2));
      } else if (action === "dec") {
        const next = current - 0.1;
        setAutoCashoutAt((next < 1.01 ? 1.01 : next).toFixed(2));
      }
      return;
    }

    let v = value.target.value;
    if (v === "") {
      setAutoCashoutAt("2.00");
      return;
    }
    if (v.startsWith(".")) v = "0" + v;

    if (v.includes(".")) {
      const [int, dec] = v.split(".");
      v = (int.replace(/^0+(?!$)/, "") || "0") + "." + (dec || "").slice(0, 2);
    }

    const num = parseFloat(v);
    if (isNaN(num) || num < 1.01) {
      setAutoCashoutAt("1.01");
    } else {
      setAutoCashoutAt(num.toFixed(2));
    }
  };

  const handleManualBet = () => {
    const amount = parseFloat(betAmount);
    if (amount <= 0 || amount > parseFloat(balance)) {
      toast.error("Invalid amount or insufficient balance");
      return;
    }
    dispatch(placeBet({ amount, autoCashoutMultiplier: autoCashoutAt }));
  };

  const handleToggleAutoBet = () => {
    if (isAutoBetting) {
      firstAutoRun.current = true;
      dispatch(stopAutoPlay());
    } else {
      const amount = parseFloat(betAmount);
      const multiplier = parseFloat(autoCashoutAt);

      if (amount <= 0 || amount > parseFloat(balance)) {
        toast.error("Invalid bet amount or insufficient balance");
        return;
      }
      if (multiplier < 1.01) {
        toast.error("Auto cashout must be >= 1.01x");
        return;
      }

      firstAutoRun.current = true;
      dispatch(startAutoPlay({ amount, multiplier }));
    }
  };

  const handleActiveTab = (index) => {
    setActiveTab(index);
    setTabs((prev) => prev.map((t, i) => ({ ...t, isActive: i === index })));
  };

  const handleCashout = () => {
    if (!currentBet || !multiplier) return;

    const profit = (multiplier * currentBet - currentBet).toFixed(2);

    setManualCashoutProfit(profit);
    dispatch(cashout());
  };

  const isBettingPhase =
    (gameState === "betting" || gameState === "loading") && !hasBet;
  const isFlyingWithBet = gameState === "flying" && hasBet;

  return (


    <div className="flex flex-col-reverse m-auto
    bg-midnight-teal rounded-b-none border border-b-0 border-grayborder2
p-[22px]
    rounded-[29px]

    sm:border-none sm:bg-transparent w-full sm:m-0 sm:flex-col sm:max-w-full sm:p-2
    md1:max-w-[250px] xl:max-w-[276px] xl:p-0 mt-1.5  xl:pt-1.5! "
    >
      <Tabs tabs={tabs} onClick={handleActiveTab} />

      <div className="mb-3.5 sm:mt-3.5 sm:mb-0 flex flex-col">
        <div className="mb-3.5">
          <InputField
            label="Bet Amount"
            rightLabel="USDT"
            value={betAmount}
            icon={usdt}
            showActions
            onChange={(v) => handleBetAmount(v, null)}
            onHalf={() => handleBetAmount(null, "half")}
            onDouble={() => handleBetAmount(null, "double")}
          />
        </div>

        <div className="mb-3.5">
          <InputField
            label="Auto Cashout"
            rightLabel="x"
            value={autoCashoutAt}
            showIncrement
            onChange={(e) => handleCashoutAt(e, "text")}
            onIncrement={() => handleCashoutAt(null, "inc")}
            onDecrement={() => handleCashoutAt(null, "dec")}
          />
        </div>

        {activeTab === 0 && (
          <div className="-order-1 sm:order-0 mb-3.5">
            {/* <div className="mb-3.5"> */}
            <CustomButton
              title={
                isBettingPhase
                  ? "Place Bet"
                  : isFlyingWithBet
                    ? "Cash Out"
                    : "Waiting..."
              }
              variant={isBettingPhase ? "default" : "secondary"}
              onClick={isFlyingWithBet ? handleCashout : handleManualBet}
              disabled={!isBettingPhase && !isFlyingWithBet}
              className="w-full text-lg font-bold"
            />
          </div>
        )}

        <InputField
          label="Profit on Win"
          rightLabel="USDT"
          icon={usdt}
          value={displayProfit}
          disabled
          className={hasBet ? "text-green-400 font-bold animate-pulse" : ""}
        />

        <div
          className="mt-4 h-full lg:h-[300px]"

          // className="mt-4"
          // style={{ height: activeTab === 0 ? "300px" : "300px" }}
          // style={{ height: "100%" }}
        >
          <PlayersBetsPanel activeTab={activeTab} icon={usdt} />
          {activeTab === 1 && (
            <div className="mb-3.5">
              <CustomButton
                title={isAutoBetting ? "Stop Auto Bet" : "Start Auto Bet"}
                variant={isAutoBetting ? "danger" : "default"}
                onClick={handleToggleAutoBet}
                disabled={isAutoBetting ? false : !isBettingPhase}
                className="w-full text-lg font-bold"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrashSidebar;
