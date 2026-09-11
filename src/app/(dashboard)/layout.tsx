import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center space-x-2 font-bold text-primary">
            HostelHub Panel
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-2 px-4">
            {session?.user?.role === "STUDENT" && (
              <>
                <Link href="/student" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/student/bookings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  My Bookings
                </Link>
                <Link href="/student/complaints" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  Complaints
                </Link>
              </>
            )}

            {(session?.user?.role === "WARDEN" || session?.user?.role === "OWNER") && (
              <>
                <Link href="/warden" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/warden/students" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  Students
                </Link>
                <Link href="/warden/bookings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  Bookings
                </Link>
                <Link href="/warden/complaints" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  Complaints
                </Link>
              </>
            )}
            
            {/* Fallback links for development/testing if no session */}
            {!session && (
              <>
                <Link href="/student" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  Student View
                </Link>
                <Link href="/warden" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  Warden View
                </Link>
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex w-full flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center justify-end gap-4">
            <span className="text-sm font-medium">{session?.user?.name || "Guest"}</span>
            <Link href="/api/auth/signout">
              <Button variant="outline" size="sm">Logout</Button>
            </Link>
          </div>
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
