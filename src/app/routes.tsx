import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { StartPage } from "./pages/StartPage";
import { GamePage } from "./pages/GamePage";
import { WinLossPage } from "./pages/WinLossPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: StartPage },
      { path: "game", Component: GamePage },
      { path: "win-loss", Component: WinLossPage },
      { path: "*", Component: StartPage }, // redirect unknowns to start
    ],
  },
]);
