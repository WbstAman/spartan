import CustomLayout from '../../Layout/CustomLayout/CustomLayout'
import PumpSiderBar from './components/PumpSiderBar/PumpSiderBar'
import Pump from '../../components/Games/Pump/Pump'
import GameHeader from '../../components/Games/GameHeader/GameHeader'

const PumpPage = () => {
    return (
        <CustomLayout>
            <div className="py-0 pt-8 sm:py-6">
                <div className="max-w-[1136px] w-full m-auto rounded-[20px] sm:bg-midnight-teal sm:p-4 md:pt-4 md:pr-4 md:pb-8.5 md:pl-6">
                    <div className="game-grid">
                        <div className="game-subgrid">
                            <PumpSiderBar />
                            <Pump />
                        </div>
                    </div>
                </div>
            </div>
        </CustomLayout>
    )
}

export default PumpPage