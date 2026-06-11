// src/components/SportsFestival/SportsFestivalScreen.tsx
import { useGameState, useGameDispatch } from "../../context/GameContext";
import WalkingMap from "./WalkingMap";
import ArcheryGame from "./ArcheryGame";
import GolfGame from "./GolfGame";
import TicTacToeGame from "./TicTacToeGame";
import GomokuGame from "./GomokuGame";
import RunningGame from "./RunningGame";
import GameCG from "./GameCG";
import StampBook from "./StampBook";
import PrizeClaim from "./PrizeClaim";
import { MiniGameRating } from "../../types/game";
import styles from "./SportsFestivalScreen.module.css";

export default function SportsFestivalScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const sf = state.sportsFestival;
  if (!sf) return null;

  const handleGameStart = () => {
    dispatch({ type: "START_SPORTS_FESTIVAL" });
  };

  const handleGameComplete = (rating: MiniGameRating) => {
    if (!sf.currentGame) return;
    dispatch({ type: "END_SPORTS_GAME", game: sf.currentGame, rating });
  };

  const handleClaimPrize = () => {
    dispatch({ type: "CLAIM_SPORTS_PRIZE" });
  };

  switch (sf.phase) {
    case "walking":
      return <WalkingMap />;
    case "playing":
      if (!sf.currentGame) return <WalkingMap />;
      switch (sf.currentGame) {
        case "archery":
          return <ArcheryGame onComplete={handleGameComplete} />;
        case "golf":
          return <GolfGame onComplete={handleGameComplete} />;
        case "tictactoe":
          return <TicTacToeGame onComplete={handleGameComplete} />;
        case "gomoku":
          return <GomokuGame onComplete={handleGameComplete} />;
        case "running":
          return <RunningGame onComplete={handleGameComplete} />;
        default:
          return <WalkingMap />;
      }
    case "cg":
      if (!sf.currentGame) return <WalkingMap />;
      return (
        <GameCG
          game={sf.currentGame}
          rating={sf.lastGameRating!}
          completedCount={sf.completedGames.length}
        />
      );
    case "stamp":
      return <StampBook />;
    case "prize":
      return <PrizeClaim onClaim={handleClaimPrize} />;
    default:
      return <WalkingMap />;
  }
}
