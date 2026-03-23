import "./study-tracker.css";
import StudyTrackerApp from "./_components/StudyTrackerApp";

export const metadata = {
  title: "QA Study Tracker | QA PlayGround",
  description:
    "Track your QA learning progress — Manual Testing, Automation, API Testing, Playwright and more.",
};

export default function StudyTrackerPage() {
  return <StudyTrackerApp />;
}
