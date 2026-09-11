import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default async function HostelDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Mock data for the selected hostel
  const hostel = { 
    id: slug, 
    name: "Backpackers Paradise", 
    city: "Berlin", 
    country: "Germany", 
    rating: 4.8, 
    description: "A cozy and friendly hostel located in the heart of Berlin. Perfect for solo travelers and groups looking to explore the city's vibrant culture.",
    address: "123 Main St, Berlin 10115",
  };

  const mockRooms = [
    { id: "r1", type: "4-Bed Mixed Dorm", price: 25, available: 2 },
    { id: "r2", type: "6-Bed Female Dorm", price: 20, available: 4 },
    { id: "r3", type: "Private Double Room", price: 60, available: 1 },
  ];

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{hostel.name}</h1>
        <p className="text-muted-foreground">{hostel.city}, {hostel.country} • <span className="text-yellow-600 dark:text-yellow-500 font-medium">★ {hostel.rating}</span></p>
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
            <p className="text-muted-foreground leading-relaxed">{hostel.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
            <div className="space-y-4">
              {mockRooms.map((room) => (
                <Card key={room.id}>
                  <CardHeader>
                    <CardTitle className="text-xl">{room.type}</CardTitle>
                    <CardDescription>{room.available} beds available</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="font-bold text-2xl">${room.price}<span className="text-sm font-normal text-muted-foreground"> / night</span></span>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Book Now</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Complete your booking</DialogTitle>
                          <DialogDescription>
                            You are booking a {room.type} at {hostel.name}.
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
                          <Button type="submit" className="w-full">Proceed to Payment</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                  </CardContent>
                </Card>
              ))}
            </div>
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
        </div>

      </div>
    </div>
  );
}
