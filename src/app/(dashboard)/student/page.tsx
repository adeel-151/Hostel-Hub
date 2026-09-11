import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: { studentId: session.user.id },
    include: {
      bed: {
        include: {
          room: {
            include: {
              floor: {
                include: {
                  building: {
                    include: {
                      hostel: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const complaints = await prisma.complaint.findMany({
    where: { studentId: session.user.id, status: "OPEN" },
  });

  const upcomingBookings = bookings.filter((b) => b.status === "CONFIRMED" && new Date(b.endDate) > new Date());
  const pastBookings = bookings.filter((b) => b.status === "COMPLETED" || new Date(b.endDate) <= new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {session.user.name}</h1>
        <p className="text-muted-foreground">Manage your bookings and hostel stays.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Stays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Stays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>Your hostel reservations.</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hostel</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.bed.room.floor.building.hostel.name}</TableCell>
                    <TableCell>Room {booking.bed.room.number} — {booking.bed.label}</TableCell>
                    <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                        booking.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {booking.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No bookings found. Browse hostels to make your first booking!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
