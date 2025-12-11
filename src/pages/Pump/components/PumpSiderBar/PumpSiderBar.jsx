import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import bitCoin from "../../../../assets/images/bitCoin.png";
import CustomButton from "../../../../components/UI/Buttons/CustomButton";
import CustomSwitchButton from "../../../../components/UI/Buttons/CustomSwitchButton";
import CustomSelectInputField from "../../../../components/UI/InputFields/CustomSelectInputField/CustomSelectInputField";
import InputField from "../../../../components/UI/InputFields/InputField";
import Tabs from "../../../../components/UI/Tab/Tabs";
import { difficultyLevel, dummyBalloonsScore, pumpLevel, tabsMenu } from "../../../../constant";
import { setCurrentIndex, setLastRandom, setLosingIndex } from "../../../../slice/balloonsSlice";
import { setBetAmount, setDifficulty, setInitiateGame, setIsCashOutAt } from "../../../../slice/commonSlice";
import SetPercentage from "../../../../components/UI/SetPercentage/SetPercentage";
import { motion, AnimatePresence } from "framer-motion";

const PumpSiderBar = ({ gameState }) => {
    const dispatch = useDispatch();

    const { difficulty, betAmount, profit, initiateGame } = useSelector((state) => state.common)
    const { currentIndex, losingIndex, lastRandom } = useSelector((state) => state.balloons);

    console.log('initiateGame', initiateGame)

    // set Balloon color
    const normalizedDifficulty = (difficulty || "easy").toLowerCase();

    // Score Data
    const scoresForDifficulty = dummyBalloonsScore[normalizedDifficulty] || [];

    const [tabs, setTabs] = useState(tabsMenu);
    const [mode, setMode] = useState(false);
    const [updatebutton, setUpadteButton] = useState(false)
    const [activeTab, setActiveTab] = useState(0)
    const isBetState = gameState === "crashed" || gameState === "waiting";

    const [value, setValue] = useState(0);
    const [tab, setTab] = useState("reset");

    useEffect(() => {
        if (gameState === "crashed" || gameState === "waiting") {
            setUpadteButton(false)
        }
    }, [isBetState, updatebutton]);

    const handleDifficultyLevel = (selectedValue) => {
        dispatch(setDifficulty(selectedValue))
    };

    // ---------- Bet Amount ----------
    const handleBetAmount = (value, action) => {
        let updateBetAmt = "";
        if (action === null) {
            let v = String(value);

            if (v.startsWith(".")) {
                v = "0" + v;
            }

            if (v.includes(".")) {
                let [intPart, decPart] = v.split(".");

                intPart = intPart.replace(/^0+(?!$)/, "") || "0";
                decPart = decPart.slice(0, 2); // max 2 decimals

                updateBetAmt = decPart.length ? `${intPart}.${decPart}` : intPart;
            } else {
                updateBetAmt = v.replace(/^0+(?!$)/, "") || "0";
            }

            dispatch(setBetAmount(updateBetAmt));
            return;
        }

        const num = Number(betAmount) || 0;

        if (action === "half") {
            updateBetAmt = (num / 2).toFixed(2);
        } else if (action === "double") {
            updateBetAmt = (num * 2).toFixed(2);
        }
        dispatch(setBetAmount(updateBetAmt));
    };

    const handlePlay = () => {
        dispatch(setInitiateGame("playing"))
        dispatch(setIsCashOutAt(false))
    }
    // ---------- Cashout At ----------
    const handleCashout = () => {
        dispatch(setIsCashOutAt(true))
        dispatch(setInitiateGame("ideal"))
    };

    const handlePump = () => {
        if (initiateGame !== "playing" || currentIndex === null) return;
        const currentScore = scoresForDifficulty[currentIndex].score;
        const maxScore = scoresForDifficulty[scoresForDifficulty.length - 1].score;
        const randomValue = Number((Math.random() * maxScore).toFixed(2));
        dispatch(setLastRandom(randomValue))

        // GAME RULE:
        // If random < current score → LOSE
        if (randomValue < currentScore) {
            dispatch(setInitiateGame("lost"))
            dispatch(setLosingIndex(currentIndex))
            return;
        }

        // Survived this pump
        if (currentIndex === scoresForDifficulty.length - 1) {
            setResult("won");
            dispatch(setInitiateGame("won"))

        } else {
            dispatch(setCurrentIndex(currentIndex + 1))
        }
    };

    const handleActiveTab = (index) => {
        setActiveTab(index)
        setTabs((prev) =>
            prev.map((t, i) => ({
                ...t,
                isActive: i === index,
            }))
        );
    }

    return (
        // <div className="bg-midnight-teal border-t border-grayborder2 p-5.5 rounded-t-[29px] sm:border-none sm:bg-transparent flex flex-col-reverse sm:p-0 w-full m-auto sm:m-0 sm:flex-col sm:max-w-full md1:max-w-[250px] xl:max-w-[276px] xl:p-0 overflow-auto hideScroll h-auto  md1:h-[632px] ">

                <div className="bg-midnight-teal border-t border-grayborder2 p-5.5 rounded-t-[29px] sm:border-none sm:bg-transparent flex flex-col-reverse sm:p-0 w-full m-auto sm:m-0 sm:flex-col sm:max-w-full md1:max-w-[250px] xl:max-w-[276px] xl:p-0 overflow-auto hideScroll h-auto  ">
            <Tabs tabs={tabs} setTabs={setTabs} onClick={handleActiveTab} />

            <div className="mb-3.5 sm:mt-3.5 sm:mb-0">
                {/* Bet Amount */}
                <div className="mb-3.5">
                    <InputField
                        label="Bet Amount"
                        rightLabel="$0.00"
                        value={betAmount}
                        icon={bitCoin}
                        showActions
                        onChange={(v) => handleBetAmount(v, null)}
                        onHalf={() => handleBetAmount(null, "half")}
                        onDouble={() => handleBetAmount(null, "double")}
                    />
                </div>

                <div className="mb-3.5">
                    <CustomSelectInputField
                        options={difficultyLevel}
                        value={difficulty}
                        onChange={handleDifficultyLevel}
                        label="Difficulty"
                        // disabled={initiateGame !== "ideal"}
                        disabled={initiateGame == "playing"}

                    />
                </div>

                {
                    activeTab == "1" &&
                    <>
                        <div className="mb-3.5">
                            <CustomSelectInputField
                                options={pumpLevel}
                                value={difficulty}
                                // onChange={handleDifficultyLevel}
                                label="Pumps"
                                maxHeight={300}
                                // disabled={initiateGame !== "ideal"}
                                disabled={initiateGame == "playing"}

                            />
                        </div>

                        <div className="mb-3.5">
                            <InputField
                                label="Number of Bets"
                                value={betAmount}
                                icon={bitCoin}
                                showActions
                                onChange={(v) => handleBetAmount(v, null)}
                                onHalf={() => handleBetAmount(null, "half")}
                                onDouble={() => handleBetAmount(null, "double")}
                            />
                        </div>

                        <div className="flex justify-between mb-3.5">
                            <label className="text-gray text-[14px] font-bold font-InstrumentBold leading-[17px]">
                                Advanced
                            </label>
                            <CustomSwitchButton mode={mode} setMode={setMode} isLabel={false} />
                        </div>

                        <AnimatePresence initial={false}>
                            {mode && (
                                <motion.div
                                    key="advanced-settings"
                                    initial={{ opacity: 0, height: 0, y: -8 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -8 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="overflow-hidden" // important for height animation
                                >
                                    <div className="mb-3.5">
                                        <SetPercentage
                                            label="On Win"
                                            value={value}
                                            onChange={setValue}
                                            tab={tab}
                                            setTab={setTab}
                                        />
                                    </div>

                                    <div className="mb-3.5">
                                        <SetPercentage
                                            label="On Loss"
                                            value={value}
                                            onChange={setValue}
                                            tab={tab}
                                            setTab={setTab}
                                        />
                                    </div>

                                    <div className="mb-3.5">
                                        <InputField
                                            label="Stop on profit"
                                            value={betAmount}
                                            icon={bitCoin}
                                            showActions={false}
                                            onChange={(v) => handleBetAmount(v, null)}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mb-3.5">
                            <CustomButton
                                title={"Start Autobet"}
                                variant={initiateGame !== "playing" ? "default" : "secondary"}
                                disabled={betAmount <= 0}
                                onClick={initiateGame !== "playing" ? handlePlay : handleCashout}
                            />
                        </div>
                    </>
                }

                {activeTab == "0" &&
                    <>
                        <div className="mb-3.5">
                            <CustomButton
                                title={initiateGame !== "playing" ? "Bet (Next Round)" : "Cash Out"}
                                variant={initiateGame !== "playing" ? "default" : "secondary"}
                                disabled={betAmount <= 0}
                                onClick={initiateGame !== "playing" ? handlePlay : handleCashout}
                            />
                        </div>

                        <div className={`mb-3.5 bg-[#18303B] rounded-lg  ${initiateGame == "lost" || initiateGame == "ideal" ? "" : "shadow-[0px_4px_4px_0px_#00000040]"} `}>
                            <CustomButton
                                title={"Pump"}
                                variant={"primary"}
                                disabled={initiateGame == "lost" || initiateGame == "ideal"}
                                onClick={handlePump}
                            />
                        </div>
                    </>
                }

                {activeTab == "0" &&
                    <InputField
                        label={`Total profit (1.00⨯)`}
                        rightLabel="$0.00"
                        icon={bitCoin}
                        value={profit}
                    />
                }
            </div>
        </div>
    );
};

export default PumpSiderBar;
