import { Experience } from "./Experience";
import { ExperienceLink } from "./ExperienceLink";
import { ExperienceRole } from "./ExperienceRole";

export const EXPERIENCE: readonly Experience[] = [
    new Experience("UBS", "https://www.ubs.com", "/experience/ubs.jpg", "Zurich, Switzerland", undefined, "Full time", [
        new ExperienceRole("Staff Software Engineer", "2025-11", null, undefined),
    ]),
    new Experience(
        "Julius Baer",
        "https://www.juliusbaer.com",
        "/experience/julius-baer.jpg",
        "Zurich, Switzerland",
        undefined,
        "Full time",
        [
            new ExperienceRole(
                "Lead Software Engineer",
                "2023-06",
                "2025-09",
                "Lead software engineer in the Regulatory Transaction and Position Datapool."
            ),
            new ExperienceRole(
                "Senior Software Engineer",
                "2022-12",
                "2023-05",
                "Senior software engineer in the Holistic Advice ART, leading technical implementations, software design, software architecture and technical interviews."
            ),
        ]
    ),
    new Experience(
        "Sonar",
        "https://www.sonarsource.com",
        "/experience/sonar.jpg",
        "Geneva, Switzerland",
        new ExperienceLink("/experience/sonarqube/", "My commits in SonarQube"),
        "Full time",
        [
            new ExperienceRole(
                "Senior Software Engineer",
                "2021-10",
                "2022-12",
                "Senior software engineer in the SonarQube software engineering team."
            ),
        ]
    ),
    new Experience(
        "insightsoftware",
        "https://insightsoftware.com",
        "/experience/insightsoftware.jpg",
        "London, United Kingdom",
        undefined,
        "Full time",
        [
            new ExperienceRole(
                "Lead Software Engineer",
                "2019-10",
                "2021-09",
                "Head software engineer of the Vizlib software."
            ),
        ]
    ),
];
