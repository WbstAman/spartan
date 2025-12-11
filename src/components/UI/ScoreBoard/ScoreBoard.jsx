import { IoIosArrowBack } from 'react-icons/io';
import { useSelector } from 'react-redux';
import ReloadIcon from '../../../assets/images/svgImages/ReloadIcon';

const ScoreBoard = () => {
    const { score } = useSelector((state) => state.crash);
    return (
        <>
            <div className='flex justify-end items-start gap-2 px-4 sm:px-0 w-full  overflow-hidden sm:overflow-auto'>
                {score && score.length > 0 ?
                    <div className='flex justify-end items-center gap-2 '>
                        {score.map((item, ind) =>
                            <span key={ind} className={`rounded-3xl w-[67px]  p-2.5 text-xs font-bold ${item?.isWin ? "bg-yellow-dark text-primary-black" : "bg-scorebox-gray text-white"}`}>{item?.point}x</span>)
                        }
                    </div>
                    :
                    <> </>
                }

                <div>
                    <div className='bg-scorebox-gray rounded-full w-9 h-9 flex justify-center items-center cursor-pointer hover:bg-midnight-teal'>
                        <ReloadIcon />
                    </div>

                    {/* <div className='flex justify-center items-center mt-2'>
                        <IoIosArrowBack className='text-sm' />
                        <span className='text-[#B1BAD3] text-xs leading-4 '>You</span>
                    </div> */}
                </div>
            </div>
        </>
    )
}
export default ScoreBoard
