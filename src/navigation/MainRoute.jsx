import { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import PublicRoute from "../Layout/Routes/PublicRoute";
import CrashPage from "../pages/Crash";
import Hilo from "../pages/Hilo/Hilo";
import PumpPage from "../pages/Pump/Pump";
import { pathConstant } from "./pathConstant";

const MainRoute = () => {
  return (
    <div>
      <Router>
        {/* <Suspense fallback={<LuLoader />}> */}
        <Suspense fallback={<span>Loading...</span>}>
          <Routes>
            <Route
              path={pathConstant.home}
              element={
                <PublicRoute>
                  <CrashPage />
                </PublicRoute>
              }
            />

            {/* <Route
              path={pathConstant.hilo}
              element={
                <PublicRoute>
                  <Hilo />
                </PublicRoute>
              }
            /> */}

            <Route
              path={pathConstant.pump}
              element={
                <PublicRoute>
                  <PumpPage />
                </PublicRoute>
              }
            />


          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};

export default MainRoute;