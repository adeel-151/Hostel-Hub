import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data
const mockHostels = [
  { id: "h1", name: "Backpackers Paradise", city: "Berlin", country: "Germany", rating: 4.8, price: 25 },
  { id: "h2", name: "City Center Hostel", city: "London", country: "UK", rating: 4.5, price: 45 },
  { id: "h3", name: "Sunny Days Hostel", city: "Barcelona", country: "Spain", rating: 4.9, price: 30 },
  { id: "h4", name: "Alpine Retreat", city: "Zurich", country: "Switzerland", rating: 4.7, price: 55 },
  { id: "h5", name: "Urban Jungle", city: "New York", country: "USA", rating: 4.2, price: 60 },
  { id: "h6", name: "Beachfront Vibes", city: "Bali", country: "Indonesia", rating: 4.6, price: 15 },
];

export default function HostelsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6 flex-shrink-0">
          <div>
            <h3 className="text-lg font-medium mb-4">Search</h3>
            <Input placeholder="Search hostels..." />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input type="number" placeholder="Min" />
                <span>-</span>
                <Input type="number" placeholder="Max" />
              </div>
            </div>
          </div>
          <Button className="w-full">Apply Filters</Button>
        </div>

        {/* Listings */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Available Hostels</h1>
            <p className="text-muted-foreground">{mockHostels.length} results found</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockHostels.map((hostel) => (
              <Card key={hostel.id} className="overflow-hidden flex flex-col">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">Image Placeholder</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{hostel.name}</CardTitle>
                  <CardDescription>{hostel.city}, {hostel.country}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-yellow-600 dark:text-yellow-500">★ {hostel.rating}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="font-bold text-lg">${hostel.price} / night</span>
                  <Link href={`/hostels/${hostel.id}`}>
                    <Button variant="default" size="sm">View</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
