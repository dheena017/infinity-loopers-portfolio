// src/data.js

const visualTypes = ['GAS_GIANT', 'ICE_WORLD', 'VOLCANIC', 'TERRESTRIAL', 'NEBULA'];

const getRandomVisual = (index) => {
    const type = visualTypes[index % visualTypes.length];
    let colors = [];

    switch (type) {
        case 'GAS_GIANT':
            colors = ['#8E44AD', '#2680bdff', '#ECF0F1']; // Deep Purple/Blue + White
            break;
        case 'ICE_WORLD':
            colors = ['#A9CCE3', '#EBF5FB', '#D6EAF8']; // Cyan/White + Silver
            break;
        case 'VOLCANIC':
            colors = ['#17202A', '#C0392B', '#F1C40F']; // Dark Charcoal + Red/Orange
            break;
        case 'TERRESTRIAL':
            colors = ['#27AE60', '#2E86C1', '#D4AC0D']; // Green/Blue + Bronze
            break;
        case 'NEBULA':
            colors = ['#FF9FF3', '#54A0FF', '#FECA57']; // Pastel Pink/Blue + Pearl
            break;
        default:
            colors = ['#ffffff', '#888888', '#000000'];
    }

    return {
        type,
        colors
    };
};

export const mentors = [
    {
        id: "mentor-1",
        name: "Cyber Sentinel",
        role: "Security Architect",
        description: "Guardian of the digital fortress. Specializes in cybersecurity, ethical hacking, and system defense strategies.",
        color: 0x00f2ff, // Cyan
        visual: { type: 'ICE_WORLD', colors: ['#00f2ff', '#ffffff', '#222222'] },
        tags: ["Cybersecurity", "Network Defense", "Encryption"],
        github: "https://github.com/infinity-loopers",
        linkedin: "https://linkedin.com/in/infinity-loopers"
    },
    {
        id: "mentor-2",
        name: "Code Weaver",
        role: "Full Stack Lead",
        description: "Master of the stack. Weaves complex backend logic with seamless frontend experiences.",
        color: 0x9b59b6, // Purple
        visual: { type: 'GAS_GIANT', colors: ['#9b59b6', '#8e44ad', '#ecf0f1'] },
        tags: ["Full Stack", "React", "Node.js", "System Design"],
        github: "https://github.com/infinity-loopers",
        linkedin: "https://linkedin.com/in/infinity-loopers"
    },
    {
        id: "mentor-3",
        name: "Data Oracle",
        role: "AI & Data Scientist",
        description: "Seer of patterns. Transforms raw data into actionable intelligence through machine learning and analytics.",
        color: 0xffaa00, // Gold
        visual: { type: 'TERRESTRIAL', colors: ['#ffaa00', '#f39c12', '#2c3e50'] },
        tags: ["AI/ML", "Python", "Data Science", "Big Data"],
        github: "https://github.com/infinity-loopers",
        linkedin: "https://linkedin.com/in/infinity-loopers"
    },
    {
        id: "mentor-4",
        name: "Cloud Titan",
        role: "DevOps Engineer",
        description: "Architect of the skies. Builds scalable, resilient cloud infrastructure and automated pipelines.",
        color: 0xff4444, // Red
        visual: { type: 'VOLCANIC', colors: ['#c0392b', '#e74c3c', '#2c3e50'] },
        tags: ["DevOps", "AWS", "Docker", "Kubernetes"],
        github: "https://github.com/infinity-loopers",
        linkedin: "https://linkedin.com/in/infinity-loopers"
    }
];

export const coreTeam = [
    {
        id: "core-1",
        name: "Nebula Navigator",
        role: "System Architect",
        description: "The visionary who maps the uncharted territories of our digital universe.",
        colors: ['#ff00cc', '#3300ff', '#000000'],
        photo: "https://via.placeholder.com/300",
        github: "#",
        linkedin: "#"
    },
    {
        id: "core-2",
        name: "Quantum Quasar",
        role: "Lead Engineer",
        description: "Harnessing the power of code to bend reality and exceed limitations.",
        colors: ['#00ff99', '#00ccff', '#000000'],
        photo: "https://via.placeholder.com/300",
        github: "#",
        linkedin: "#"
    },
    {
        id: "core-3",
        name: "Void Walker",
        role: "Creative Director",
        description: "Crafting visual experiences that pull users into the event horizon.",
        colors: ['#ff9900', '#ff0000', '#220000'],
        photo: "https://via.placeholder.com/300",
        github: "#",
        linkedin: "#"
    },
    {
        id: "core-4",
        name: "Cosmic Keeper",
        role: "Community Lead",
        description: "Maintaining the gravity that holds the entire system together.",
        colors: ['#aa00ff', '#ff00aa', '#110033'],
        photo: "https://via.placeholder.com/300",
        github: "#",
        linkedin: "#"
    }
];

// Helper to manually create consistent visuals for the static list below
// (We use a loop here to generate the giant list once, but for the file output we write it explicitly)
// NOTE: I am generating the full list below so you can edit each one individually.

export const students = [
    {
        id: "student-1",
        name: "Cadet 1",
        role: "Apprentice",
        mentorId: "mentor-1",
        color: 0x00f2ff,
        visual: getRandomVisual(0),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-2",
        name: "Cadet 2",
        role: "Apprentice",
        mentorId: "mentor-2",
        color: 0x9b59b6,
        visual: getRandomVisual(1),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-3",
        name: "Cadet 3",
        role: "Apprentice",
        mentorId: "mentor-3",
        color: 0xffaa00,
        visual: getRandomVisual(2),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-4",
        name: "Cadet 4",
        role: "Apprentice",
        mentorId: "mentor-4",
        color: 0xff4444,
        visual: getRandomVisual(3),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-5",
        name: "Cadet 5",
        role: "Apprentice",
        mentorId: "mentor-1",
        color: 0x00f2ff,
        visual: getRandomVisual(4),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-6",
        name: "Cadet 6",
        role: "Apprentice",
        mentorId: "mentor-2",
        color: 0x9b59b6,
        visual: getRandomVisual(5),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-7",
        name: "Cadet 7",
        role: "Apprentice",
        mentorId: "mentor-3",
        color: 0xffaa00,
        visual: getRandomVisual(6),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-8",
        name: "Cadet 8",
        role: "Apprentice",
        mentorId: "mentor-4",
        color: 0xff4444,
        visual: getRandomVisual(7),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-9",
        name: "Cadet 9",
        role: "Apprentice",
        mentorId: "mentor-1",
        color: 0x00f2ff,
        visual: getRandomVisual(8),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-10",
        name: "Cadet 10",
        role: "Apprentice",
        mentorId: "mentor-2",
        color: 0x9b59b6,
        visual: getRandomVisual(9),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-11",
        name: "Cadet 11",
        role: "Apprentice",
        mentorId: "mentor-3",
        color: 0xffaa00,
        visual: getRandomVisual(10),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-12",
        name: "Cadet 12",
        role: "Apprentice",
        mentorId: "mentor-4",
        color: 0xff4444,
        visual: getRandomVisual(11),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-13",
        name: "Cadet 13",
        role: "Apprentice",
        mentorId: "mentor-1",
        color: 0x00f2ff,
        visual: getRandomVisual(12),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-14",
        name: "Cadet 14",
        role: "Apprentice",
        mentorId: "mentor-2",
        color: 0x9b59b6,
        visual: getRandomVisual(13),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-15",
        name: "Cadet 15",
        role: "Apprentice",
        mentorId: "mentor-3",
        color: 0xffaa00,
        visual: getRandomVisual(14),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-16",
        name: "Cadet 16",
        role: "Apprentice",
        mentorId: "mentor-4",
        color: 0xff4444,
        visual: getRandomVisual(15),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-17",
        name: "Cadet 17",
        role: "Apprentice",
        mentorId: "mentor-1",
        color: 0x00f2ff,
        visual: getRandomVisual(16),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-18",
        name: "Cadet 18",
        role: "Apprentice",
        mentorId: "mentor-2",
        color: 0x9b59b6,
        visual: getRandomVisual(17),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-19",
        name: "Cadet 19",
        role: "Apprentice",
        mentorId: "mentor-3",
        color: 0xffaa00,
        visual: getRandomVisual(18),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-20",
        name: "Cadet 20",
        role: "Apprentice",
        mentorId: "mentor-4",
        color: 0xff4444,
        visual: getRandomVisual(19),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-21",
        name: "Cadet 21",
        role: "Apprentice",
        mentorId: "mentor-1",
        color: 0x00f2ff,
        visual: getRandomVisual(20),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-22",
        name: "Cadet 22",
        role: "Apprentice",
        mentorId: "mentor-2",
        color: 0x9b59b6,
        visual: getRandomVisual(21),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-23",
        name: "Cadet 23",
        role: "Apprentice",
        mentorId: "mentor-3",
        color: 0xffaa00,
        visual: getRandomVisual(22),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-24",
        name: "Cadet 24",
        role: "Apprentice",
        mentorId: "mentor-4",
        color: 0xff4444,
        visual: getRandomVisual(23),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-25",
        name: "Cadet 25",
        role: "Apprentice",
        mentorId: "mentor-1",
        color: 0x00f2ff,
        visual: getRandomVisual(24),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-26",
        name: "Cadet 26",
        role: "Apprentice",
        mentorId: "mentor-2",
        color: 0x9b59b6,
        visual: getRandomVisual(25),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-27",
        name: "Cadet 27",
        role: "Apprentice",
        mentorId: "mentor-3",
        color: 0xffaa00,
        visual: getRandomVisual(26),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-28",
        name: "Cadet 28",
        role: "Apprentice",
        mentorId: "mentor-4",
        color: 0xff4444,
        visual: getRandomVisual(27),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-29",
        name: "Cadet 29",
        role: "Apprentice",
        mentorId: "mentor-1",
        color: 0x00f2ff,
        visual: getRandomVisual(28),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-30",
        name: "Cadet 30",
        role: "Apprentice",
        mentorId: "mentor-2",
        color: 0x9b59b6,
        visual: getRandomVisual(29),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-31",
        name: "Cadet 31",
        role: "Apprentice",
        mentorId: "mentor-3",
        color: 0xffaa00,
        visual: getRandomVisual(30),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-32",
        name: "Cadet 32",
        role: "Apprentice",
        mentorId: "mentor-4",
        color: 0xff4444,
        visual: getRandomVisual(31),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    },
    {
        id: "student-33",
        name: "Cadet 33",
        role: "Apprentice",
        mentorId: "mentor-1",
        color: 0x00f2ff,
        visual: getRandomVisual(32),
        photo: "https://via.placeholder.com/150",
        github: "#",
        linkedin: "#"
    }
];
