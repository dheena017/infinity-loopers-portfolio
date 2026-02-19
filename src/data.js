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

// Generating 33 students distributed among mentors with unique visuals
export const students = Array.from({ length: 35 }, (_, i) => {
    const mentorIndex = i % 4; // Distribute cyclically among 4 mentors
    const mentor = mentors[mentorIndex];

    // Generate unique visual properties based on index to ensure variety
    // We add some randomness to the base archetype colors to make each student unique
    const baseVisual = getRandomVisual(i);

    // Perturb colors slightly for uniqueness
    // (In a real app, we'd use HSL manipulation here, but let's stick to base palettes for now)

    return {
        id: `student-${i + 1}`,
        name: `Cadet ${i + 1}`,
        role: `Apprentice ${mentor.role}`,
        description: `Dedicated learner under the guidance of ${mentor.name}. Focusing on ${mentor.tags[0]} and ${mentor.tags[1]}.`,
        mentorId: mentor.id,
        color: mentor.color, // Inherits mentor's color theme for UI
        visual: baseVisual, // Unique planet look
        tags: [mentor.tags[0], "Learning", "Junior Dev"],
        github: "https://github.com/infinity-loopers",
        linkedin: "https://linkedin.com/in/infinity-loopers"
    };
});
