import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const featuredHostels = await prisma.hostel.findMany({
    take: 3,
    orderBy: { rating: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      country: true,
      rating: true,
    },
  });

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-secondary py-24 md:py-32 lg:py-40 flex items-center justify-center">
        <div className="container px-4 md:px-6 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-accent">
              Find Your Perfect Stay
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover comfortable and affordable hostels worldwide. Book your next adventure with HostelHub.
            </p>
          </div>
          <div className="w-full max-w-2xl mx-auto bg-card p-4 rounded-xl shadow-lg border flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Where are you going?" className="h-12 text-lg border-none shadow-none focus-visible:ring-0" />
            </div>
            <Link href="/hostels">
              <Button size="lg" className="h-12 px-8 w-full md:w-auto">
                Search Hostels
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Hostels</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore some of our highest-rated accommodations recommended by travelers.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            {featuredHostels.map((hostel) => (
              <div key={hostel.id} className="flex flex-col group overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">{hostel.name}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="font-semibold leading-none tracking-tight">{hostel.name}</h3>
                  <p className="text-sm text-muted-foreground">{hostel.city}, {hostel.country}</p>
                </div>
                <div className="p-6 pt-0 mt-auto flex items-center justify-between">
                  {hostel.rating && (
                    <span className="font-medium text-yellow-600 dark:text-yellow-500">★ {hostel.rating.toString()}</span>
                  )}
                  <Link href={`/hostels/${hostel.slug}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/hostels">
              <Button variant="secondary" size="lg">View All Hostels</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
