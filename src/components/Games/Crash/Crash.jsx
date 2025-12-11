import GameHeader from "../GameHeader/GameHeader";
import CrashContent from "./CrashContent";
import CrashSidebar from "./CrashSidebar/CrashSidebar";
import "./Crash.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initGame } from "../../../slice/crashSlice";

const Crash = () => {
  const dispatch = useDispatch();
  const { balance, gameState } = useSelector((state) => state.crash)

  useEffect(() => {
    if (gameState === "loading") {
      dispatch(initGame());
    }
  }, [dispatch, gameState]);

  return (
     <div className="py-0 pt-8 sm:py-6">
      <div className="sm:bg-midnight-teal max-w-[1140px] w-full m-auto rounded-xl sm:p-1 md1:pt-1.5 md1:pr-1.5 md1:pb-3 md1:pl-3 ">
        <div className="game-grid">
          <div className="game-subgrid">
            <CrashSidebar />
            <CrashContent />
          </div>
          <div className="hidden sm:block">
            <GameHeader gameName="Crash" balance={balance} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crash;
