import tree from "../../../../assets/images/hilo/tree.png"
export const Card = ({ suit, value, isActive = false }) => {
    const isRed = suit === "♥" || suit === "♦";

    return (
        // <div
        //     className={`relative w-[121px] h-[190px] bg-white rounded-lg flex flex-col items-center justify-center font-bold transition-all ${isActive ? "ring-4 ring-neon-pink shadow-[0_0_30px_rgba(255,0,255,0.5)]" : "shadow-lg"
        //         }`}
        // >
                <div
            className={`relative w-[121px] h-[190px] bg-white rounded-lg 
               flex items-start justify-start flex-col p-5
                font-bold transition-all ${isActive ? "ring-4 ring-[red]  shadow-[0_0_30px_rgba(255,0,255,0.5)]" : "shadow-lg"
                }`}
        >
            <div className={`text-[51px] ${isRed ? "text-red-600" : "text-black"}`}>
                {value}
            </div>
            <div className={`text-[51px] ${isRed ? "text-red-600" : "text-black"}`}>
                {suit}
            </div>
        </div>
    );
};
