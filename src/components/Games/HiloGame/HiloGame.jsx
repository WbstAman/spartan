import { useCallback, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import CustomButton from "../../UI/Buttons/CustomButton";
 import { Card } from "./components/Card";
import { SmallCard } from "./components/SmallCard";
import usdt from "../../../assets/images/usdt.jpg";
import { LuArrowDownToLine, LuArrowUpToLine } from "react-icons/lu";
import InputField from "../../UI/InputFields/InputField";

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const HiloGame = () => {
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState("0.00000000");
  const [currentCard, setCurrentCard] = useState(null);
  const [history, setHistory] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);


  console.log('history', history)

  const createDeck = useCallback(() => {
    const deck = [];
    suits.forEach((suit) => {
      values.forEach((value, index) => {
        deck.push({
          suit,
          value,
          numValue: index + 1,
        });
      });
    });
    return deck.sort(() => Math.random() - 0.5);
  }, []);

  const [deck, setDeck] = useState(createDeck());

  const drawCard = useCallback(() => {
    if (deck.length === 0) {
      const newDeck = createDeck();
      setDeck(newDeck);
      return newDeck[0];
    }
    const card = deck[0];
    setDeck((prev) => prev.slice(1));
    return card;
  }, [deck, createDeck]);

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

  const startGame = () => {

    // const bet = parseFloat(betAmount);
    // if (isNaN(bet) || bet <= 0) {
    //   toast.error("Please enter a valid bet amount");
    //   return;
    // }

    const card = drawCard();
    setCurrentCard(card);
    setIsPlaying(true);
    setHistory([{ ...card, trend: undefined, odds: undefined }]);
    setTotalProfit(0);
    // toast.success("Game started!");
  };

  const calculateOdds = (currentValue, isHigher) => {
    const cardsLeft = 52;
    let favorableCards = 0;

    if (isHigher) {
      favorableCards = (13 - currentValue) * 4 + 4; // Cards higher + same
    } else {
      favorableCards = (currentValue - 1) * 4 + 4; // Cards lower + same
    }

    const probability = favorableCards / cardsLeft;
    return Math.max(1.01, 0.95 / probability); // House edge of 5%
  };

  const placeBet = (isHigher) => {
    if (!currentCard || !isPlaying) return;

    const bet = parseFloat(betAmount);
    // if (isNaN(bet) || bet <= 0) {
    //   toast.error("Invalid bet amount");
    //   return;
    // }

    const nextCard = drawCard();
    const won =
      (isHigher && nextCard.numValue >= currentCard.numValue) ||
      (!isHigher && nextCard.numValue <= currentCard.numValue);

    const odds = calculateOdds(currentCard.numValue, isHigher);
    const profit = won ? bet * odds - bet : -bet;

    setTotalProfit((prev) => prev + profit);

    const trend =
      nextCard.numValue > currentCard.numValue
        ? "up"
        : nextCard.numValue < currentCard.numValue
          ? "down"
          : "same";

    setHistory((prev) => [
      ...prev.slice(-2),
      { ...nextCard, trend, odds: won ? `${odds.toFixed(2)}x` : "0.00x" },
    ]);

    if (won) {
      // toast.success(`Win! +${profit.toFixed(8)} (${odds.toFixed(2)}x)`);
      setCurrentCard(nextCard);
    } else {
      // toast.error(`Loss! -${Math.abs(profit).toFixed(8)}`);
      setCurrentCard(nextCard);
    }
  };

  const skipCard = () => {
    if (!isPlaying) return;
    const nextCard = drawCard();
    setCurrentCard(nextCard);
    // toast.info("Card skipped");
  };

  const cashout = () => {
    if (!isPlaying) return;
    setBalance((prev) => prev + totalProfit);
    setIsPlaying(false);
    // toast.success(
    //   `Cashed out! ${totalProfit >= 0 ? "+" : ""}${totalProfit.toFixed(8)}`
    // );
  };

  const higherOdds = currentCard ? calculateOdds(currentCard.numValue, true) : 0;
  const lowerOdds = currentCard ? calculateOdds(currentCard.numValue, false) : 0;
  const higherProb = currentCard ? (100 / higherOdds).toFixed(2) : "0";
  const lowerProb = currentCard ? (100 / lowerOdds).toFixed(2) : "0";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel */}
      <div className="w-80 bg-space-medium border-r border-border p-6 space-y-4">

        {/* Bet Amount */}
        <div className="mb-3.5">
          <InputField
            label="Bet Amount"
            rightLabel="$0.00"
            value={betAmount}
            icon={usdt}
            showActions
            onChange={(v) => handleBetAmount(v, null)}
            onHalf={() => handleBetAmount(null, "half")}
            onDouble={() => handleBetAmount(null, "double")}
          />
        </div>

        {/* Start Gane */}
        <CustomButton
          onClick={isPlaying ? cashout : startGame}
          title={isPlaying ? "Cashout" : "Start Game"}
        />

        {/* <CustomButton
          variant="primary"
          onClick={skipCard}
          title={"Skip Card"}
        /> */}

        {isPlaying && (
          <CustomButton
            onClick={skipCard}
            variant="primary"
            className="w-full border-border text-foreground"
            title={"Skip Card"}
          />
        )}

        <div className="space-y-2">

          <CustomButton
            onClick={() => placeBet(true)}
            disabled={!isPlaying}
            variant="primary"
            title={"Higher or Same"}
          />

          <CustomButton
            onClick={() => placeBet(true)}
            disabled={!isPlaying}
            variant="primary"
            title={"Lower or Same"}
          />


          {/* <CustomButton
            onClick={() => placeBet(true)}
            disabled={!isPlaying}
             title={"Higher or Same"}
            // className="w-full bg-space-dark hover:bg-space-dark/80 border border-border justify-between"
          >
            <span>Higher or Same</span>
            <span className="flex items-center gap-2">
              <BsArrowUp className="h-4 w-4 text-neon-yellow" />
              <span className="text-neon-yellow">{higherProb}%</span>
            </span>
          </CustomButton> */}

          {/* <CustomButton
            onClick={() => placeBet(false)}
            disabled={!isPlaying}
            className="w-full bg-space-dark hover:bg-space-dark/80 border border-border justify-between"
          >
            <span>Lower or Same</span>
            <span className="flex items-center gap-2">
              <BsArrowDown className="h-4 w-4 text-neon-pink" />
              <span className="text-neon-pink">{lowerProb}%</span>
            </span>
          </CustomButton> */}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Profit (1.55×)</span>
            <span className="text-foreground">${totalProfit.toFixed(2)}</span>
          </div>
          <div className="relative">
            <InputField
              type="text"
              value={totalProfit.toFixed(8)}
              readOnly
              className="pr-10 bg-space-dark border-border text-foreground"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neon-yellow">
              ⚫
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-12 flex items-center justify-center gap-12">
          <div className="text-center ">
            <div
              className="max-w-[74px] h-[110px] bg-space-dark rounded-lg flex items-center justify-center flex-col mb-2 border border-border relative cursor-pointer"
              onClick={() => placeBet(true)} // Higher or Same
            >

              <div className="text-xl font-bold leading-3.5 mb-4">K</div>
              <LuArrowUpToLine className=" h-6 w-6" />
            </div>
            <div className="text-xs font-semibold">
              KING BEING
              <br />
              THE HIGHEST
            </div>
          </div>

          {currentCard ? (
            <Card suit={currentCard.suit} value={currentCard.value} isActive />
          ) : (
            <div className="w-28 h-40 bg-space-dark rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <span className="text-muted-foreground">?</span>
            </div>
          )}

          <div className="text-center">
            <div
              className="max-w-[74px] h-[110px] bg-space-dark rounded-lg flex items-center justify-center flex-col mb-2 border border-border relative cursor-pointer"
              onClick={() => placeBet(true)} // Higher or Same
            >
              <div className="text-xl font-bold leading-3.5 mb-4">A</div>
              <LuArrowDownToLine className=" h-6 w-6" />
            </div>
            <div className="text-xs text-muted-foreground">
              ACE BEING
              <br />
              THE LOWEST
            </div>
          </div>
        </div>

        {/* Profit Display */}
        <div className="w-full max-w-3xl bg-space-medium rounded-lg p-6 mb-8 border border-border">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Profit Higher ({higherOdds.toFixed(2)}×)
              </div>
              <div className="relative">
                <InputField
                  type="text"
                  value={
                    currentCard
                      ? (
                        parseFloat(betAmount || "0") * higherOdds -
                        parseFloat(betAmount || "0")
                      ).toFixed(8)
                      : "0.00000000"
                  }
                  readOnly
                  className="pr-10 bg-space-dark border-border text-foreground"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neon-yellow">
                  ⚫
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Profit Lower ({lowerOdds.toFixed(2)}×)
              </div>
              <div className="relative">
                <InputField
                  type="text"
                  value={
                    currentCard
                      ? (
                        parseFloat(betAmount || "0") * lowerOdds -
                        parseFloat(betAmount || "0")
                      ).toFixed(8)
                      : "0.00000000"
                  }
                  readOnly
                  className="pr-10 bg-space-dark border-border text-foreground"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neon-yellow">
                  ⚫
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card History */}
        {history.length > 0 && (
          <div className="flex gap-4 w-full">
            {history.map((card, index) => (
              <SmallCard
                key={index}
                suit={card.suit}
                value={card.value}
                isStart={index === 0}
                trend={card.trend}
                odds={card.odds}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HiloGame