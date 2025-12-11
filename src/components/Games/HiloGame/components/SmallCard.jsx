
export const SmallCard = ({ suit, value, isStart, trend, odds }) => {
    const isRed = suit === "♥" || suit === "♦";

    const getTrendColor = () => {
        if (odds === "0.00x") return "bg-red-600";
        if (trend === "up") return "bg-green-600";
        if (trend === "down") return "bg-red-600";
        return "bg-green-600";
    };

    return (
        <div className="flex flex-col items-center gap-1 w-[78px] h-[125px]">
            <div className="relative w-20 h-28 bg-white rounded-md flex flex-col items-center justify-center shadow-md">
                <div className={`text-xl font-semibold ${isRed ? "text-red-600" : "text-black"}`}>
                    {value}
                </div>
                <div className={`text-2xl ${isRed ? "text-red-600" : "text-black"}`}>
                    {suit}
                </div>
                {trend && !isStart && (
                    <div className="absolute top-2 right-2">
                        {trend === "up" ? (
                            <span className="text-green-600 text-lg">▲</span>
                        ) : trend === "down" ? (
                            <span className="text-red-600 text-lg">▼</span>
                        ) : (
                            <span className="text-gray-600 text-lg">●</span>
                        )}
                    </div>
                )}
            </div>
            {isStart ? (
                <span className="text-xs text-green-600 font-bold px-2 py-1 bg-green-600/20 rounded">
                    Start Card
                </span>
            ) : (
                <span className={`text-xs text-white font-bold px-3 py-1 rounded ${getTrendColor()}`}>
                    {odds}
                </span>
            )}
        </div>
    );
};
