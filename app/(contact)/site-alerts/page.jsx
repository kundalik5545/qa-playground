import { redirect } from "next/navigation";

// Moved to /admin/site-alerts — only accessible to ADMIN users via Better-Auth.
export default function OldSiteAlertsPage() {
  redirect("/admin/site-alerts");
}
