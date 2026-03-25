import "./study-tracker.css";
import StudyTrackerProvider from "./_components/StudyTrackerProvider";
import Sidebar from "./_components/Sidebar";

export default function StudyTrackerLayout({ children }) {
  return (
    <StudyTrackerProvider>
      <div className="st-root">
        <Sidebar />
        <div className="st-main">
          <div className="st-content">{children}</div>
        </div>
      </div>
    </StudyTrackerProvider>
  );
}
