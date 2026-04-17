export type TeamMember = {
  id: string;
  name: string;
  credentials?: string;
  role: string;
  bio: string[];
  email?: string;
  status: "present" | "past";
};

/**
 * Placeholder team data — replace with Sanity-backed data when schema is ready.
 */
export const teamMembers: TeamMember[] = [
  {
    id: "holden-spaht",
    name: "Holden Spaht",
    credentials: "AIA",
    role: "Principal",
    bio: [
      "Holden is the founding principal of Gentle Works, bringing a thoughtful approach to architecture that bridges commercial ambition with community impact.",
    ],
    email: "holden@gentle.works",
    status: "present",
  },
  {
    id: "emily-wirt",
    name: "Emily Wirt",
    credentials: "AIA, IIDA, LEED GA",
    role: "Director of Design",
    bio: [
      "Emily leads the design vision at Gentle Works with a multidisciplinary background spanning architecture, interior design, and sustainable building practices.",
    ],
    email: "emily@gentle.works",
    status: "present",
  },
  {
    id: "anna-kiningham",
    name: "Anna Kiningham",
    credentials: "RA",
    role: "Project Architect",
    bio: [
      "Anna brings precision and care to every project, managing complex builds from concept through construction administration.",
    ],
    email: "anna@gentle.works",
    status: "present",
  },
  {
    id: "alex-bumgarner",
    name: "Alex Bumgarner",
    role: "Designer",
    bio: [
      "Alex contributes fresh perspectives to the studio's residential and hospitality work, with a focus on material research and detailing.",
    ],
    email: "alex@gentle.works",
    status: "present",
  },
  {
    id: "clay-kiningham",
    name: "Clay Kiningham",
    credentials: "RA",
    role: "Project Architect",
    bio: [
      "Clay manages project delivery with an emphasis on constructability and craft, ensuring design intent carries through to the built work.",
    ],
    email: "clay@gentle.works",
    status: "present",
  },
  {
    id: "john-carlisle",
    name: "John Carlisle",
    role: "Designer",
    bio: [
      "John supports the studio's design development process, contributing to schematic design and visualization across multiple project types.",
    ],
    email: "john@gentle.works",
    status: "present",
  },
  {
    id: "morgan-strickland",
    name: "Morgan Strickland",
    role: "Project Designer",
    bio: [
      "With 10 years of experience in architecture and interior design, Morgan is an innovative and creative project lead. She holds a Bachelor of Science in Architecture from the Georgia Institute of Technology and has worked with both corporate and boutique studios across the country. Currently, Morgan focuses on residential and hospitality architecture and interiors, drawn to designing the thoughtful, human-scale details that transform spaces into truly magical experiences. Morgan is passionate about collaborating with local artisans to create beautiful, unique moments that make each project feel personal and extraordinary. With a special background in art, sculpture, installations, and immersive experiences, she integrates these creative practices into her professional work, infusing each design with a distinctive sense of craftsmanship.",
      "Outside of her professional life, Morgan enjoys studying ethnobotany, gardening, and renovating her 1950s ranch home, reflecting her love for both design and nature.",
    ],
    email: "morgan@gentle.works",
    status: "present",
  },
  {
    id: "nour-khalifa",
    name: "Nour Khalifa",
    role: "Designer",
    bio: [
      "Nour brings an international perspective to the studio, with experience across commercial and civic project types.",
    ],
    email: "nour@gentle.works",
    status: "present",
  },
];
