import { AdminNavigation, type AdminNavItem } from "@/components/AdminNavigation";
import type { SessionUser } from "@/lib/session";

type AdminShellProps = {
  active: AdminNavItem;
  children: React.ReactNode;
  notificationCount?: number;
  searchPlaceholder?: string;
  session: SessionUser;
};

export function AdminShell({ active, children, notificationCount = 0, searchPlaceholder, session }: AdminShellProps) {
  return (
    <main className="admin-dashboard-shell">
      <section className="admin-main">
        <AdminNavigation
          active={active}
          notificationCount={notificationCount}
          searchPlaceholder={searchPlaceholder}
          session={session}
        />
        {children}
      </section>
    </main>
  );
}
