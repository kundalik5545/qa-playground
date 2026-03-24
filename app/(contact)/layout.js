import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="container mx-auto max-w-6xl py-16 px-4 md:px-0">
      {children}
    </div>
  );
};

export default MainLayout;
