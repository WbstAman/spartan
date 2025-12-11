import { useSelector } from "react-redux";
import ProgressRing from "../../UI/ProgressRing/ProgressRing";
import ScoreBoard from "../../UI/ScoreBoard/ScoreBoard";
import CrashGraph from "./CrashGame/components/CrashGraph/CrashGraph";

const CrashContent = () => {
  const { multiplier, gameState, countdown, history } = useSelector((state) => state.crash);

  return (
    <div className="mi bg-background text-foreground w-full mx-auto px-0 h-[294px] sm:px-1 md1:px-0 sm:h-[400px] md:h-[490px] md1:h-[699px]">
      <div className="mx-auto crash-graph-container py-3 md1:p-6 rounded-md h-full overflow-auto">
        <div className="relative h-full flex items-center justify-center">
          <div className="absolute top-0 z-20 left-auto right-0 w-[96%] sm:w-full">
            {gameState !== "loading" && <ScoreBoard />}
          </div>
          {gameState === "loading" ? (
            <ProgressRing countdown={countdown} />
          ) : (
            <CrashGraph
              multiplier={multiplier}
              gameState={gameState}
              history={history}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CrashContent;