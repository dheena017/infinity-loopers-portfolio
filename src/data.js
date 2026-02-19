// src/data.js

export const mentors = [
    {
        id: "mentor-1",
        name: "Cyber Sentinel",
        role: "Security Architect",
        description: "Guardian of the digital fortress. Specializes in cybersecurity, ethical hacking, and system defense strategies.",
        color: 0x00f2ff, // Cyan
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
        tags: ["DevOps", "AWS", "Docker", "Kubernetes"],
        github: "https://github.com/infinity-loopers",
        linkedin: "https://linkedin.com/in/infinity-loopers"
    }
];

// Generating 33 students distributed among mentors
export const students = Array.from({ length: 35 }, (_, i) => {
    const mentorIndex = i % 4; // Distribute cyclically among 4 mentors
    const mentor = mentors[mentorIndex];

    return {
        id: `student-${i + 1}`,
        name: `Cadet ${i + 1}`,
        role: `Apprentice ${mentor.role}`,
        description: `Dedicated learner under the guidance of ${mentor.name}. Focusing on ${mentor.tags[0]} and ${mentor.tags[1]}.`,
        mentorId: mentor.id,
        color: mentor.color, // Inherits mentor's color theme
        tags: [mentor.tags[0], "Learning", "Junior Dev"],
        github: "https://github.com/infinity-loopers",
        linkedin: "https://linkedin.com/in/infinity-loopers"
    };
});
