import { lazy, Suspense } from "react";
import { LoadingProvider } from "./context/LoadingProvider";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

const MainContainer = lazy(() => import("./components/MainContainer"));

const App = () => {
  return (
    <LoadingProvider>
      <Suspense fallback={null}>
        <MainContainer />
      </Suspense>
      <SpeedInsights />
    </LoadingProvider>
  );
};

export default App;
