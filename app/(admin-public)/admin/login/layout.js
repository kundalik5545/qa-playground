"use client";

import { useEffect } from "react";

export default function LoginLayout({ children }) {
  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => document.body.classList.remove("admin-page");
  }, []);
  return children;
}
