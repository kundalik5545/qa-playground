export default function StudyTrackerLayout({ children }) {
  return (
    <div
      style={{
        /* Break out of the root layout's max-w-7xl container */
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        width: "100vw",
        /* Cancel main's py-3 (12px) then push below the 64px fixed navbar */
        marginTop: "-12px",
        paddingTop: "64px",
      }}
    >
      {children}
    </div>
  );
}
