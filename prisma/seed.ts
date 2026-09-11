import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create hostels
  const hostel1 = await prisma.hostel.upsert({
    where: { slug: "al-rehman-boys-hostel" },
    update: {},
    create: {
      name: "Al-Rehman Boys Hostel",
      slug: "al-rehman-boys-hostel",
      rating: 4.5,
      address: "GT Road, Near UET",
      city: "Lahore",
      country: "Pakistan",
    },
  });

  const hostel2 = await prisma.hostel.upsert({
    where: { slug: "city-girls-hostel" },
    update: {},
    create: {
      name: "City Girls Hostel",
      slug: "city-girls-hostel",
      rating: 4.2,
      address: "University Road",
      city: "Peshawar",
      country: "Pakistan",
    },
  });

  const hostel3 = await prisma.hostel.upsert({
    where: { slug: "elite-student-lodge" },
    update: {},
    create: {
      name: "Elite Student Lodge",
      slug: "elite-student-lodge",
      rating: 4.8,
      address: "Blue Area, F-6",
      city: "Islamabad",
      country: "Pakistan",
    },
  });

  console.log("✅ Hostels created");

  // Create buildings, floors, rooms, and beds for hostel1
  const building1 = await prisma.building.create({
    data: {
      hostelId: hostel1.id,
      name: "Block A",
      address: "Main Building",
    },
  });

  const floor1 = await prisma.floor.create({
    data: {
      buildingId: building1.id,
      number: 1,
    },
  });

  const room1 = await prisma.room.create({
    data: {
      floorId: floor1.id,
      number: "101",
      type: "double",
      price: 8000,
      capacity: 2,
    },
  });

  const room2 = await prisma.room.create({
    data: {
      floorId: floor1.id,
      number: "102",
      type: "single",
      price: 12000,
      capacity: 1,
    },
  });

  const bed1 = await prisma.bed.create({
    data: {
      roomId: room1.id,
      label: "Bed A",
    },
  });

  const bed2 = await prisma.bed.create({
    data: {
      roomId: room1.id,
      label: "Bed B",
    },
  });

  const bed3 = await prisma.bed.create({
    data: {
      roomId: room2.id,
      label: "Bed A",
    },
  });

  console.log("✅ Building, floors, rooms, beds created");

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@hostelhub.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@hostelhub.com",
      hashedPassword,
      role: "ADMIN",
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@hostelhub.com" },
    update: {},
    create: {
      name: "Hostel Owner",
      email: "owner@hostelhub.com",
      hashedPassword,
      role: "OWNER",
      hostelId: hostel1.id,
    },
  });

  const warden = await prisma.user.upsert({
    where: { email: "warden@hostelhub.com" },
    update: {},
    create: {
      name: "Hostel Warden",
      email: "warden@hostelhub.com",
      hashedPassword,
      role: "WARDEN",
      hostelId: hostel1.id,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@hostelhub.com" },
    update: {},
    create: {
      name: "Ali Ahmed",
      email: "student@hostelhub.com",
      hashedPassword,
      role: "STUDENT",
    },
  });

  console.log("✅ Users created");

  // Create a booking for the student
  await prisma.booking.create({
    data: {
      studentId: student.id,
      bedId: bed1.id,
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-06-30"),
      status: "CONFIRMED",
    },
  });

  console.log("✅ Sample booking created");

  // Create a complaint
  await prisma.complaint.create({
    data: {
      hostelId: hostel1.id,
      studentId: student.id,
      category: "Maintenance",
      message: "The fan in room 101 is not working properly.",
      status: "OPEN",
    },
  });

  console.log("✅ Sample complaint created");

  // Create a subscription
  await prisma.subscription.create({
    data: {
      hostelId: hostel1.id,
      plan: "premium",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-01-01"),
      status: "ACTIVE",
    },
  });

  console.log("✅ Sample subscription created");
  console.log("\n🎉 Seeding complete!");
  console.log("\n📧 Test accounts (password: password123):");
  console.log("   Admin:   admin@hostelhub.com");
  console.log("   Owner:   owner@hostelhub.com");
  console.log("   Warden:  warden@hostelhub.com");
  console.log("   Student: student@hostelhub.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
