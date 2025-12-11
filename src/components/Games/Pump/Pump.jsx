import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BalloonIcon1 from "../../../assets/images/balloon/BalloonIncon1";
import DemoIcon from "../../../assets/images/balloon/DemoIcon/DemoIcon";
import EasyBgIcon from "../../../assets/images/balloon/EasyBgIcon";
import { dummyBalloonsScore } from "../../../constant";
import {
  setCurrentIndex,
  setCurrentScore,
  setLastRandom,
  setLosingIndex,
} from "../../../slice/balloonsSlice";
import CustomScoreBox from "../../UI/CustomScoreBox/CustomScoreBox";
import BlankBalloonIcon from "../../../assets/images/balloon/BlankBalloonIcon";
import BalloonIcon from "../../../assets/images/balloon/BalloonIcon";
import ChimneyIcon from "../../../assets/images/balloon/ChimneyIcon";

const AnimatedLabel = ({ value, duration = 600, className = "" }) => {
  const [display, setDisplay] = useState(value);
  const [scale, setScale] = useState(1);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const prevNumRef = useRef(null);

  // parse value into numeric + suffix
  const parseValue = (val) => {
    if (typeof val !== "string") return { num: NaN, suffix: "", decimals: 2 };
    const trimmed = val.trim();
    // find first non-number (except .) from end
    const match = trimmed.match(/^(-?\d*\.?\d+)(.*)$/);
    if (!match) {
      return { num: NaN, suffix: "", decimals: 2 };
    }
    const num = parseFloat(match[1]);
    const suffix = match[2] || "";
    // decimals to preserve = decimals in input number (if any)
    const decimalsMatch = match[1].split(".")[1];
    const decimals = decimalsMatch ? decimalsMatch.length : 2;
    return { num, suffix, decimals };
  };

  useEffect(() => {
    const { num: newNum } = parseValue(value);
    const { num: prevNum } = parseValue(display);

    // if either is NaN or identical strings, just pulse & set display directly
    if (isNaN(newNum) || isNaN(prevNum) || value === display) {
      setDisplay(value);
      // pulse
      setScale(1.12);
      const t = setTimeout(() => setScale(1), 180);
      return () => clearTimeout(t);
    }

    // animate numeric value
    const start = performance.now();
    startRef.current = start;
    const from = prevNumRef.current != null ? prevNumRef.current : prevNum;
    const to = newNum;
    prevNumRef.current = to;

    // parse suffix and decimals for formatting
    const { suffix, decimals } = parseValue(value);

    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

    const step = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutQuad(t);
      const current = from + (to - from) * eased;
      // format with requested decimals but trim trailing zeros if possible
      const formatted =
        decimals === 0 ? Math.round(current).toString() : current.toFixed(decimals);
      setDisplay(formatted + suffix);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // complete
        setDisplay(Number(to).toFixed(decimals) + suffix);
      }
    };

    // start animation
    rafRef.current = requestAnimationFrame(step);

    // pulse scale
    setScale(1.18);
    const pulseTimeout = setTimeout(() => setScale(1), 220);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(pulseTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // run when value string changes

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        transition: "transform 220ms cubic-bezier(.22,.9,.3,1)",
        willChange: "transform",
      }}
    >
      {display}
    </span>
  );
};

const DIFFICULTY_COLORS = {
  expert: "#FF2828",
  medium: "#922BE1",
  hard: "#FF6600",
  easy: "#0679FD",
};

const DEFAULT_BALLOON_COLOR = "#0679FD";

const Pump = () => {
  const dispatch = useDispatch();

  const { difficulty, initiateGame, isCashOut } = useSelector(
    (state) => state.common
  );
  const { screenWidth } = useSelector((state) => state.common.screenSize);
  const { currentIndex, losingIndex, currentScore, lastRandom } = useSelector(
    (state) => state.balloons
  );

  // balloon color
  const normalizedDifficulty = (difficulty || "easy").toLowerCase();
  const balloonColor =
    DIFFICULTY_COLORS[normalizedDifficulty] ?? DEFAULT_BALLOON_COLOR;

  // scores list
  const baseScores = dummyBalloonsScore[normalizedDifficulty] || [];

  const [result, setResult] = useState("idle");
  const [balloonScale, setBalloonScale] = useState(1);

  // active score label
  const activeLabel = (() => {
    if (currentIndex === null) return "1.0x";
    let currScore = baseScores[currentIndex]?.title || "";
    dispatch(setCurrentScore(currScore));
    return currScore;
  })();

  // 🔥 SCORE CHIP AUTO-SCROLL
  const chipsContainerRef = useRef(null);
  const chipRefs = useRef([]);

  useEffect(() => {
    if (currentIndex == null) return;

    const container = chipsContainerRef.current;
    const activeChip = chipRefs.current[currentIndex];

    if (!container || !activeChip) return;

    const chipRect = activeChip.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const isOutOfView =
      chipRect.left < containerRect.left ||
      chipRect.right > containerRect.right;

    if (isOutOfView) {
      activeChip.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  //  Start game
  useEffect(() => {
    if (initiateGame === "playing") {

      if (!baseScores.length) return;
      dispatch(setCurrentIndex(0));
      dispatch(setLosingIndex(null));
      dispatch(setLastRandom(null));
      if (currentIndex) {
        setBalloonScale(1);
      }
    } else {
      if (currentIndex) {
        setBalloonScale(1);
      }
    }
  }, [initiateGame, baseScores.length, dispatch]);

  useEffect(() => {
    if (!activeLabel) {
      if (currentIndex) {
        setBalloonScale(1);
      }
      return;
    }

    if (currentIndex) {

      setBalloonScale((prev) => {
        const next = prev - 0.05;
        return next < 0.8 ? 0.8 : next;
      });
    }
  }, [activeLabel]);

  // -------------------------------------------------
  // (Optional) Randomized data — keep from your previous version
  // -------------------------------------------------
  const [randomCache, setRandomCache] = useState({});
  const randFloat = (min, max) => Math.random() * (max - min) + min;
  const formatProfitValue = (val) => Number(val).toFixed(8);
  const formatProfit = (val) => Number(val).toFixed(4);
  const formatChance = (val) => Number(val).toFixed(6);
  const generateRandomForIndex = (index) => {
    const baseFactor = 1 + index * 0.02;
    const profitValue = formatProfitValue(randFloat(0.00000001, 0.001) * baseFactor);
    const profit = formatProfit(randFloat(0.0001, 0.5) * baseFactor);
    const chance = formatChance(randFloat(1, 99) / baseFactor);
    return { profitValue, profit, chance, generatedAt: Date.now() };
  };

  useEffect(() => {
    if (currentIndex == null) return;
    setRandomCache((prev) => {
      if (prev[currentIndex]) return prev;
      const generated = generateRandomForIndex(currentIndex);
      try {
        dispatch(setLastRandom(generated.profitValue));
      } catch (e) { }
      return { ...prev, [currentIndex]: generated };
    });
  }, [currentIndex, dispatch]);

  const scoresForDifficulty = baseScores.map((s, idx) => {
    const rnd = randomCache[idx];
    return {
      ...s,
      profitValue: rnd?.profitValue ?? s.profitValue ?? "0.00000000",
      profit: rnd?.profit ?? s.profit ?? "0.00",
      chance: rnd?.chance ?? s.chance ?? "0.000000",
    };
  });

  const [isFirstBet, setIsFirstBet] = useState(false);
  const [everBet, setEverBet] = useState(false);

  const handleBet = () => {
    if (!everBet) {
      setIsFirstBet(true);
      setEverBet(true);
    }
  };

  return (
    // <div className="bg-primary-black max-w-full px-[22px] py-[31px] w-full h-[550px] md:h-[632px] rounded-[22px] overflow-hidden flex justify-end flex-col relative">
    <div className="bg-primary-black max-w-full p-5 pb-[31px] w-full overflow-hidden flex justify-end flex-col relative 
    rounded-[22px] 
    h-[550px] 
    md:h-[598px]">
      <div className="w-full flex justify-between flex-col relative">
        <div className="mx-auto w-full max-h-[480px] h-full">
          {initiateGame === "ideal" && isCashOut ? (
            <>
              <div className="flyUpAnimation absolute left-0 right-0 top-[-70px] m-auto">
                <AnimatedLabel
                  value={currentScore}
                  className="text-white flex justify-center items-center h-[100px] m-auto absolute left-0 right-0 top-0 bottom-5 z-50 text-2xl sm:text-[60px]"
                />

                <BalloonIcon1
                  fill={balloonColor}
                  label={activeLabel}
                  width={screenWidth <= 640 ? "200px" : "244px"}
                  height={screenWidth <= 640 ? "180px" : "244px"}
                  left={screenWidth <= 640 ? 4 : 5}
                  top={screenWidth <= 640 ? "-45" : "-30"}
                />
                <div
                  className="w-[30px] h-5 absolute left-0 right-[-9px] top-auto bottom-0 m-auto"
                  style={{ backgroundColor: balloonColor }}
                ></div>
              </div>

              <div className="m-auto mb-3 rounded-xl border-6 border-yellow-dark w-[200px] h-[150px] flex justify-center items-center flex-col p-4 zoomInCenter">
                <span className="text-md3 text-yellow-dark pb-2 border-b-4 border-grayNormal">
                  {currentScore}
                </span>
                <span className="block text-md3 text-yellow-dark">
                  0.00000000
                </span>
              </div>
            </>
          ) : initiateGame === "lost" ? (
            <div className="relative flex items-center justify-center m-auto w-[300px] h-[295px]">
              <div
                className="absolute inset-0 rounded-full border-[6px] pop-ring"
                style={{ borderColor: balloonColor }}
              ></div>
              <div className="flex flex-col items-center justify-center rounded-full w-[300px] h-[295px]">
                <AnimatedLabel
                  value={activeLabel}
                  className="text-[60px] text-dullRed leading-none"
                />
                <span className="mt-[19px] mx-auto w-[102px] bg-[#123545] text-white text-md3 p-1.5 rounded-sm block text-center">
                  Pop
                </span>
              </div>
            </div>
          ) :
            (
              // <div className="relative w-[244px] lg:w-[244px] lg:h-[294px] xl:w-[244px] xl:h-[294px] m-auto">
              <div className="relative w-[244px] lg:w-[244px] xl:w-[244px] m-auto"
                style={{
                  left: "20px"
                }}

              >
                {activeLabel === "1.0x" ? (
                  <div className="absolute top-auto -bottom-18 m-auto left-0 right-0 w-[30px]">
                    {/* <DemoIcon isFirstBet={isFirstBet} fill={balloonColor} /> */}
                    <BalloonIcon isFirstBet={isFirstBet} fill={balloonColor} />
                  </div>
                ) :
                  (<>
                    <div
                      className="shakingAnimation m-auto top-[35px] relative"
                      style={{
                        transform: `scale(${balloonScale})`,
                        transition: "transform 0.25s ease-out",
                      }}
                    >
                      <BalloonIcon1
                        fill={balloonColor}
                        label={activeLabel}
                      // width={screenWidth <= 640 ? "200px" : "244px"}
                      // height={screenWidth <= 640 ? "180px" : "244px"}
                      // top={screenWidth <= 640 ? "-45" : "-30"}
                      // left={screenWidth <= 640 ? 15 : 18}
                      // top={15}
                      />
                    </div>







                  </>
                  )}

                <div className="m-auto w-[33px]" >

                  {
                    activeLabel !== "1.0x"
                    &&
                    <div className="m-auto h-[30px] w-8"
                      style={{ backgroundColor: balloonColor }}
                    />
                  }
                  <ChimneyIcon />
                </div>
              </div>
            )}

          {/* SCALE + BG */}
          <div
            style={{
              transform: `scaleX(${balloonScale})`,
              transition: "transform 0.25s ease-out",
            }}
          >

            <EasyBgIcon difficulty={difficulty} />
          </div>
        </div>
      </div>

      {/*  SCORE CHIPS WITH AUTO-SCROLL */}
      <CustomScoreBox
        score={scoresForDifficulty}
        chipsContainerRef={chipsContainerRef}
        chipRefs={chipRefs}
      />
    </div>
  );
};

export default Pump;
