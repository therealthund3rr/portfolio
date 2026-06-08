import { lazy, Suspense } from "react";
import { LoadingProvider } from "./context/LoadingProvider";
import "./App.css";

const MainContainer = lazy(() => import("./components/MainContainer"));

const App = () => {
  return (
    <LoadingProvider>
      <Suspense fallback={null}>
        <MainContainer />
      </Suspense>
    </LoadingProvider>
  );
};

export default App;
