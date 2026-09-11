import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HostelDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const hostel = await prisma.hostel.findUnique({
    where: { slug },
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
    },
  });

  if (!hostel) {
    notFound();
  }

  // Flatten rooms from all buildings/floors
  const allRooms = hostel.buildings.flatMap((b) =>
    b.floors.flatMap((f) =>
      f.rooms.map((r) => ({
        ...r,
        buildingName: b.name,
        floorNumber: f.number,
        availableBeds: r.beds.filter((bed) => !bed.isOccupied).length,
        totalBeds: r.beds.length,
      }))
    )
  );

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{hostel.name}</h1>
        <p className="text-muted-foreground">
          {hostel.city}, {hostel.country} •{" "}
          {hostel.rating && (
            <span className="text-yellow-600 dark:text-yellow-500 font-medium">★ {hostel.rating.toString()}</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery Placeholder */}
          <div className="aspect-video bg-muted rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <span>Main Image Placeholder</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">About this hostel</h2>
            <p className="text-muted-foreground leading-relaxed">
              Located at {hostel.address}, {hostel.city}. This hostel has {hostel.buildings.length} building(s) with a total of {allRooms.length} rooms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
            {allRooms.length > 0 ? (
              <div className="space-y-4">
                {allRooms.map((room) => (
                  <Card key={room.id}>
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Room {room.number} — {room.type}
                      </CardTitle>
                      <CardDescription>
                        {room.buildingName}, Floor {room.floorNumber} • {room.availableBeds}/{room.totalBeds} beds available
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <span className="font-bold text-2xl">
                        Rs. {room.price.toString()}
                        <span className="text-sm font-normal text-muted-foreground"> / month</span>
                      </span>

                      <Dialog>
                        <DialogTrigger 
                          disabled={room.availableBeds === 0}
                          className={buttonVariants({ variant: "default" })}
                        >
                          {room.availableBeds === 0 ? "Full" : "Book Now"}
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Complete your booking</DialogTitle>
                            <DialogDescription>
                              You are booking Room {room.number} ({room.type}) at {hostel.name}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label className="text-sm font-medium">Check-in Date</label>
                              <Input type="date" />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-medium">Check-out Date</label>
                              <Input type="date" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" className="w-full">
                              Proceed to Payment
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No rooms have been added to this hostel yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-md relative mb-4">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <span>Map Placeholder</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{hostel.address}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">City</span>
                <span className="font-medium">{hostel.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Country</span>
                <span className="font-medium">{hostel.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Buildings</span>
                <span className="font-medium">{hostel.buildings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Rooms</span>
                <span className="font-medium">{allRooms.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
