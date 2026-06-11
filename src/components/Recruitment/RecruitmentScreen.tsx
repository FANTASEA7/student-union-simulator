// src/components/Recruitment/RecruitmentScreen.tsx
import { useGameState } from "../../context/GameContext";
import RecruitmentBriefing from "./RecruitmentBriefing";
import RecruitmentSelect from "./RecruitmentSelect";
import RecruitmentInterview from "./RecruitmentInterview";

export default function RecruitmentScreen() {
  const state = useGameState();
  const rs = state.recruitState;

  if (!rs) {
    return null;
  }

  switch (rs.phase) {
    case "briefing":
      return <RecruitmentBriefing />;
    case "select":
      return <RecruitmentSelect />;
    case "interview":
      return <RecruitmentInterview />;
    default:
      return null;
  }
}
