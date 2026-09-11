import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function WardenDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const hostelId = session.user.hostelId;

  if (!hostelId) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">No hostel assigned to your account. Contact an administrator.</p>
      </div>
    );
  }

  const hostel = await prisma.hostel.findUnique({
    where: { id: hostelId },
    include: {
      buildings: {
        include: {
          floors: {
            include: {
              rooms: {
                include: {
                  beds: true,
                },
              },
            },
          },
        },
      },
      complaints: {
        where: { status: "OPEN" },
        include: { student: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!hostel) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Hostel not found.</p>
      </div>
    );
  }

  // Calculate stats
  const allBeds = hostel.buildings.flatMap((b) =>
    b.floors.flatMap((f) => f.rooms.flatMap((r) => r.beds))
  );
  const totalBeds = allBeds.length;
  const occupiedBeds = allBeds.filter((bed) => bed.isOccupied).length;
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Get recent bookings for this hostel
  const recentBookings = await prisma.booking.findMany({
    where: {
      bed: {
        room: {
          floor: {
            building: {
              hostelId,
            },
          },
        },
      },
    },
    include: {
      student: true,
      bed: {
        include: {
          room: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{hostel.name} — Dashboard</h1>
        <p className="text-muted-foreground">Manage your hostel, students, and operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableBeds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{hostel.complaints.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking activity for your hostel.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Room / Bed</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.student.name}</TableCell>
                    <TableCell>Room {booking.bed.room.number} — {booking.bed.label}</TableCell>
                    <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                        booking.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No bookings yet.</p>
          )}
        </CardContent>
      </Card>

      {hostel.complaints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Open Complaints</CardTitle>
            <CardDescription>Unresolved student complaints that need attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hostel.complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">{complaint.student.name}</TableCell>
                    <TableCell>{complaint.category}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{complaint.message}</TableCell>
                    <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Resolve</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
