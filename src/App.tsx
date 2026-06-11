// src/App.tsx
import { useGameState } from "./context/GameContext";
import { GameProvider } from "./context/GameContext";
import TitleScreen from "./components/TitleScreen/TitleScreen";
import NameInput from "./components/NameInput/NameInput";
import DepartmentSelect from "./components/DepartmentSelect/DepartmentSelect";
import InterviewScreen from "./components/InterviewScreen/InterviewScreen";
import WorkBadgeCG from "./components/WorkBadgeCG/WorkBadgeCG";
import GameScreen from "./components/GameScreen/GameScreen";
import MiniGame from "./components/MiniGame/MiniGame";
import ExamScreen from "./components/ExamScreen/ExamScreen";
import ExamResultScreen from "./components/ExamResultScreen/ExamResultScreen";
import LoveConfessScreen from "./components/LoveConfessScreen/LoveConfessScreen";
import NGPlusScreen from "./components/NGPlusScreen/NGPlusScreen";
import EndingScreen from "./components/EndingScreen/EndingScreen";
import MemoirScreen from "./components/MemoirScreen/MemoirScreen";
import Supermarket from "./components/GameScreen/Supermarket/Supermarket";
import Backpack from "./components/GameScreen/Backpack/Backpack";
import Mail from "./components/GameScreen/Mail/Mail";
import Negotiation from "./components/GameScreen/Negotiation/Negotiation";
import ContactsPanel from "./components/GameScreen/ContactsPanel/ContactsPanel";
import EventDialog from "./components/EventDialog/EventDialog";
import PromotionMeeting from "./components/PromotionMeeting/PromotionMeeting";
import SemesterSummary from "./components/SemesterSummary/SemesterSummary";
import FirstPersonDialogue from "./components/FirstPersonDialogue/FirstPersonDialogue";
import RecruitmentScreen from "./components/Recruitment/RecruitmentScreen";
import MeetNpcCG from "./components/MeetNpcCG/MeetNpcCG";
import SportsFestivalScreen from "./components/SportsFestival/SportsFestivalScreen";
import MysteriousMerchant from "./components/MysteriousMerchant/MysteriousMerchant";
import styles from "./App.module.css";

function AppRouter() {
  const { gamePhase } = useGameState();

  switch (gamePhase) {
    case "title":
      return <TitleScreen />;
    case "name_input":
      return <NameInput />;
    case "department_select":
      return <DepartmentSelect />;
    case "interview":
      return <InterviewScreen />;
    case "badge_cg":
      return <WorkBadgeCG />;
    case "meet_npc_cg":
      return <MeetNpcCG />;
    case "game":
      return <GameScreen />;
    case "event":
      return <EventDialog />;
    case "promotion_meeting":
      return <PromotionMeeting />;
    case "semester_summary":
      return <SemesterSummary />;
    case "first_person_dialogue":
      return <FirstPersonDialogue />;
    case "chair_relations":
      return <GameScreen />;
    case "schedule_planning":
    case "schedule_executing":
    case "weekend_spending":
      return <GameScreen />;
    case "supermarket":
      return <Supermarket />;
    case "backpack":
      return <Backpack />;
    case "mail":
      return <Mail />;
    case "negotiation":
      return <Negotiation />;
    case "contacts":
      return <ContactsPanel />;
    case "minigame":
      return <MiniGame />;
    case "exam":
      return <ExamScreen />;
    case "exam_result":
      return <ExamResultScreen />;
    case "love_confess":
      return <LoveConfessScreen />;
    case "ngplus_allocate":
      return <NGPlusScreen />;
    case "ending":
      return <EndingScreen />;
    case "memoir":
      return <MemoirScreen />;
    case "recruitment_briefing":
    case "recruitment_select":
    case "recruitment_interview":
      return <RecruitmentScreen />;
    case "sports_festival_walking":
    case "sports_festival_game":
    case "sports_festival_cg":
    case "sports_festival_stamp":
      return <SportsFestivalScreen />;
    case "mysterious_merchant":
      return <MysteriousMerchant />;
    default:
      return <TitleScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className={styles.app} style={{ backgroundImage: `url('${import.meta.env.BASE_URL}main_bg.png')` }}>
        <AppRouter />
      </div>
    </GameProvider>
  );
}
