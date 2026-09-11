import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HostelsPage() {
  const hostels = await prisma.hostel.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      country: true,
      rating: true,
    },
    orderBy: { rating: "desc" },
  });

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
            <p className="text-muted-foreground">{hostels.length} results found</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((hostel) => (
              <Card key={hostel.id} className="overflow-hidden flex flex-col transition-all hover:shadow-lg">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">{hostel.name}</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{hostel.name}</CardTitle>
                  <CardDescription>{hostel.city}, {hostel.country}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {hostel.rating && (
                      <span className="font-medium text-yellow-600 dark:text-yellow-500">★ {hostel.rating}</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-end">
                  <Link href={`/hostels/${hostel.slug}`}>
                    <Button variant="default" size="sm">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {hostels.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No hostels found.</p>
              <p className="text-sm">Check back later or adjust your search filters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
