import { BiSolidOffer } from "react-icons/bi";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { FaGift } from "react-icons/fa";
import { TbCircleDotted } from "react-icons/tb";

export const otherMenu = [
  {
    title: "Giveaway",
    value: "giveaway",
    icon: <FaGift className="text-gray-dark text-xl" />,
    isParent: false,
    isActive: true,
  },
  {
    title: "Promotions",
    value: "promotions",
    icon: <BiSolidOffer className="text-gray-dark text-xl" />,
    isParent: false,
    isActive: true,
  },
  {
    title: "Affilate",
    value: "affilate",
    icon: <TbCircleDotted className="text-gray-dark text-xl" />,
    isParent: false,
    isActive: true,
  },
  {
    title: "FAQ",
    value: "faq",
    icon: <BsFillQuestionCircleFill className="text-gray-dark text-xl" />,
    isParent: false,
    isActive: true,
  },
]


export const tabsMenu = [
  {
    title: "Manual",
    value:"manual",
    isActive: true,
  },
  {
    value:"auto",
    title: "Auto",
    isActive: false,
  }
]


export const difficultyLevel = [
  {
    title: "Easy",
    valie: "easy"
  },
  {
    title: "Medium",
    valie: "medium"
  },
  {
    title: "Hard",
    valie: "hard"
  },
  {
    title: "Expert",
    valie: "expert"
  }
]


export const pumpLevel = [
  { title: "1", value: "1" },
  { title: "2", value: "2" },
  { title: "3", value: "3" },
  { title: "4", value: "4" },
  { title: "5", value: "5" },
  { title: "6", value: "6" },
  { title: "7", value: "7" },
  { title: "8", value: "8" },
  { title: "9", value: "9" },
  { title: "10", value: "10" },
  { title: "11", value: "11" },
  { title: "12", value: "12" },
  { title: "13", value: "13" },
  { title: "14", value: "14" },
  { title: "15", value: "15" },
  { title: "16", value: "16" },
  { title: "17", value: "17" },
  { title: "18", value: "18" },
  { title: "19", value: "19" },
  { title: "20", value: "20" },
  { title: "21", value: "21" },
  { title: "22", value: "22" },
  { title: "23", value: "23" },
  { title: "24", value: "24" },
];


export const dummyScore = [
  { points: 20, isWin: false },
  { points: 20, isWin: true }, { points: 20, isWin: false },
  { points: 20, isWin: true }, { points: 20, isWin: false },
  { points: 20, isWin: true }, { points: 20, isWin: false },
  { points: 20, isWin: true }, { points: 20, isWin: false },
  { points: 20, isWin: true }, { points: 20, isWin: false },
  { points: 20, isWin: true }, { points: 20, isWin: false },
  { points: 20, isWin: true }, { points: 20, isWin: false },
  { points: 20, isWin: true },
]


export const dummyBalloonsScore = {
  easy:[
  { score: 1.00, title: "1.00x" },
  { score: 1.02, title: "1.02x" },
  { score: 1.07, title: "1.07x" },
  { score: 1.11, title: "1.11x" },
  { score: 1.17, title: "1.17x" },
  { score: 1.23, title: "1.23x" },
  { score: 1.29, title: "1.29x" },
  { score: 1.36, title: "1.36x" },
  { score: 1.44, title: "1.44x" },
  { score: 1.53, title: "1.53x" },
  { score: 1.63, title: "1.63x" },
  { score: 1.75, title: "1.75x" },
  { score: 1.88, title: "1.88x" },
  { score: 2.04, title: "2.04x" },
  { score: 2.23, title: "2.23x" },
  { score: 2.45, title: "2.45x" },
  { score: 2.72, title: "2.72x" },
  { score: 3.06, title: "3.06x" },
  { score: 3.50, title: "3.50x" },
  { score: 4.08, title: "4.08x" },
  { score: 4.90, title: "4.90x" },
  { score: 6.13, title: "6.13x" },
  { score: 8.17, title: "8.17x" },
  { score: 12.25, title: "12.25x" },
  { score: 24.50, title: "24.50x" }
],

  medium: [
  { score: 1.00, title: "1.00x" },
  { score: 1.11, title: "1.11x" },
  { score: 1.27, title: "1.27x" },
  { score: 1.46, title: "1.46x" },
  { score: 1.69, title: "1.69x" },
  { score: 1.98, title: "1.98x" },
  { score: 2.33, title: "2.33x" },
  { score: 2.76, title: "2.76x" },
  { score: 3.31, title: "3.31x" },
  { score: 4.03, title: "4.03x" },
  { score: 4.95, title: "4.95x" },
  { score: 6.19, title: "6.19x" },
  { score: 7.88, title: "7.88x" },
  { score: 10.25, title: "10.25x" },
  { score: 13.66, title: "13.66x" },
  { score: 18.78, title: "18.78x" },
  { score: 26.83, title: "26.83x" },
  { score: 40.25, title: "40.25x" },
  { score: 64.40, title: "64.40x" },
  { score: 112.70, title: "112.70x" },
  { score: 225.40, title: "225.40x" },
  { score: 563.50, title: "563.50x" },
  { score: 2254.00, title: "2254.00x" }
]
,

  hard:[
  { score: 1.00, title: "1.00x" },
  { score: 1.23, title: "1.23x" },
  { score: 1.55, title: "1.55x" },
  { score: 1.98, title: "1.98x" },
  { score: 2.56, title: "2.56x" },
  { score: 3.36, title: "3.36x" },
  { score: 4.48, title: "4.48x" },
  { score: 6.08, title: "6.08x" },
  { score: 8.41, title: "8.41x" },
  { score: 11.92, title: "11.92x" },
  { score: 17.34, title: "17.34x" },
  { score: 26.01, title: "26.01x" },
  { score: 40.46, title: "40.46x" },
  { score: 65.74, title: "65.74x" },
  { score: 112.70, title: "112.70x" },
  { score: 206.62, title: "206.62x" },
  { score: 413.23, title: "413.23x" },
  { score: 929.77, title: "929.77x" },
  { score: 2479.40, title: "2479.40x" },
  { score: 8677.90, title: "8677.90x" },
  { score: 52067.40, title: "52067.40x" }
]
,

  expert: [
  { score: 1.00, title: "1.00x" },
  { score: 1.63, title: "1.63x" },
  { score: 2.80, title: "2.80x" },
  { score: 4.95, title: "4.95x" },
  { score: 9.08, title: "9.08x" },
  { score: 17.34, title: "17.34x" },
  { score: 34.68, title: "34.68x" },
  { score: 73.21, title: "73.21x" },
  { score: 164.72, title: "164.72x" },
  { score: 400.02, title: "400.02x" },
  { score: 1066.73, title: "1066.73x" },
  { score: 3200.18, title: "3200.18x" },
  { score: 11200.65, title: "11200.65x" },
  { score: 48536.13, title: "48536.13x" },
  { score: 291216.80, title: "291216.80x" },
  { score: 3203384.80, title: "3203384.80x" }
]
,
};
