import StudyTrackerProvider from "./_components/StudyTrackerProvider";
import StudyTrackerShell from "./_components/StudyTrackerShell";

export default function StudyTrackerLayout({ children }) {
  return (
    <StudyTrackerProvider>
      <StudyTrackerShell>{children}</StudyTrackerShell>
    </StudyTrackerProvider>
  );
}
