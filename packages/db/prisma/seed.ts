import "dotenv/config";
import { prisma } from "../src/index.js";

const templates = [
  {
    name: "Open Office",
    previewImageUrl: "/templates/open-office.png",
    rooms: [
      { name: "Main Floor", type: "OPEN", posX: 0, posY: 0 },
      { name: "Meeting Room", type: "MEETING", posX: 1, posY: 0 },
    ],
  },
  {
    name: "Conference Hall",
    previewImageUrl: "/templates/conference.png",
    rooms: [
      { name: "Main Hall", type: "OFFICE", posX: 0, posY: 0 },
      { name: "Lounge", type: "LOUNGE", posX: 1, posY: 0 },
    ],
  },
  {
    name: "Cozy Lounge",
    previewImageUrl: "/templates/lounge.png",
    rooms: [
      { name: "Lounge", type: "LOUNGE", posX: 0, posY: 0 },
      { name: "Quiet Room", type: "MEETING", posX: 1, posY: 0 },
    ],
  },
] as const;

async function main() {
  for (const template of templates) {
    const existingTemplate = await prisma.template.findFirst({
      where: {
        name: template.name,
      },
    });

    if (existingTemplate) {
      await prisma.template.update({
        where: {
          id: existingTemplate.id,
        },
        data: {
          previewImageUrl: template.previewImageUrl,
          rooms: template.rooms,
        },
      });
      continue;
    }

    await prisma.template.create({
      data: {
        name: template.name,
        previewImageUrl: template.previewImageUrl,
        rooms: template.rooms,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
