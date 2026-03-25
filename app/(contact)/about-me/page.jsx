import Link from "next/link";
import {
  Mail,
  Linkedin,
  Github,
  Youtube,
  Twitter,
  Globe,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Me",
  robots: "noindex, nofollow",
  alternates: {
    canonical: "http://qaplayground.com/about-me",
  },
};

const ProfilePage = () => {
  const socialLinks = [
    {
      href: "mailto:kundalikjadhav5545@gmail.com",
      icon: <Mail />,
      label: "Email",
    },
    {
      href: "https://www.linkedin.com/in/kundalikjadhav1516",
      icon: <Linkedin />,
      label: "LinkedIn",
    },
    {
      href: "https://github.com/kundalik5545",
      icon: <Github />,
      label: "GitHub",
    },
    {
      href: "https://www.youtube.com/@qaplayground",
      icon: <Youtube />,
      label: "YouTube",
    },
    {
      href: "https://twitter.com/randomcoders",
      icon: <Twitter />,
      label: "Twitter",
    },
    {
      href: "https://www.qaplayground.com/",
      icon: <Globe />,
      label: "Website",
    },
  ];

  const myExp = [
    {
      role: "Automation Tester",
      company: "Lumera",
      duration: "Jan 2025 - Present",
      project:
        "DMP (DataHub) Software –  Developed an automation framework using C#, Selenium, and NUnit with database integration for data-driven testing.  Automated Client Portal and EmployerHub to ensure robust pre-production testing.",
    },
    {
      role: "Test Analyst",
      company: "ITM",
      duration: "Aug 2022 - Jan 2025",
      project:
        "Penscope (Pension Administration) – Developed an automation framework using C#, Selenium, and NUnit with JSON-based data-driven testing. Which reduce 60% manual testing effort.",
    },
    {
      role: "Junior Analyst",
      company: "Mindtree",
      duration: "Jun 2019 - Aug 2022",
      project:
        "Banking Admin – Performed manual and API testing for banking applications, focusing on quality and reliability.",
    },
  ];

  const mySkills = [
    {
      lang: "C#, Java, JavaScript, SQL",
      API_Database: " RestAssured ,RestSharp, Postman, SQL Server, PostGresSQL",
      automation: "Selenium, WebDriver, NUnit, TestNG, Playwright ",
      framework:
        "POM, Builder Pattern, Data-Driven, Testng(JSON, NUnit), SOLID Principles",
      CI_CD: " Git, Azure DevOps, Jenkins, Maven ",
      test_Management: "JIRA, Azure Test Plans",
      devSkills:
        "MERN Stack, Express.js, Node.js, React.js, Next.js, Tailwind CSS, JavaScript, TypeScript, HTML, CSS",
    },
  ];

  const keyAchivement = [
    "Employee of the month and top performer.",
    "Successfully reduced manual testing effort by 60% through automation.",
    "Contributed to the development of a comprehensive automation framework.",
    "Implemented CI/CD pipelines for efficient software delivery.",
    "Recognized for delivering high-quality software solutions in the UK Pension domain.",
  ];

  const myGithub = [
    {
      name: "Ai Website Generator",
      description:
        "Create stunning websites in minutes with our AI Website Generator. Powered by Next.js and Tailwind CSS, it offers customizable templates and seamless deployment.",
      url: "https://github.com/kundalik5545/ai-website-generator",
      liveUrl: "https://free-ai-website-generator.vercel.app/",
    },
    {
      name: "QA PlayGround",
      description:
        "A comprehensive automation testing platform with interactive labs, real-world scenarios, and built-in UI components for hands-on learning.",
      url: "https://github.com/kundalik5545/qatesting",
      liveUrl: "https://qatesting.vercel.app/",
    },
    {
      name: "Random Coders Blog",
      description:
        "A modern blogging platform for sharing automation, QA, and coding tutorials, featuring markdown support and a clean, responsive UI.",
      url: "https://github.com/kundalik5545/random_coders",
      liveUrl: "https://random-coders.vercel.app/",
    },
    {
      name: "QA Xpath",
      description:
        "A full-stack MERN application for managing and visualizing XPath queries, demonstrating best practices in React, Node.js, and MongoDB.",
      url: "https://github.com/kundalik5545/qa-xpath",
      liveUrl: "https://qa-xpath.vercel.app/",
    },
  ];

  return (
    <div className="bg-background text-foreground py-12 px-6">
      <div className="container mx-auto max-w-3xl">
        {/* Profile Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Kundalik R. Jadhav</h1>
          <div className="flex justify-center gap-4 mt-4">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center transition-transform duration-300 transform hover:scale-110 hover:text-primary"
                title={link.label}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Summary*/}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Summary</h2>
          <hr />
          <p className="mt-4 text-base text-muted-foreground">
            I am a highly skilled and motivated Test Analyst with 5.5+ years of
            experience and a strong background in automation testing & API
            testing with CI/CD pipelines. Proficient in Selenium WebDriver (C# &
            Java) and framework development.
          </p>

          <p className="mt-4 text-base text-muted-foreground">
            I have a proven track record of delivering high-quality UK Pension
            software solutions and ensuring the reliability and performance of
            applications. My expertise includes various testing methodologies,
            tools, and frameworks, making me a valuable asset to any development
            team.
          </p>
        </div>

        {/* My SKills*/}
        <div className="mt-8 pb-3">
          <h2 className="text-2xl font-semibold">Skills</h2>
          <hr />
          <div className="mt-4 grid grid-cols-1 gap-6 text-base text-muted-foreground">
            {mySkills.map((skill, index) => (
              <div key={index} className="border-primary pl-4 space-y-3">
                <div className="flex flex-col gap-2">
                  <div className="flex">
                    <span className="font-semibold text-primary min-w-[150px]">
                      Automation
                    </span>
                    <span className="ml-2">: {skill.automation}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-primary min-w-[150px]">
                      Language
                    </span>
                    <span className="ml-2">: {skill.lang}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-primary min-w-[150px]">
                      Framework
                    </span>
                    <span className="ml-2">: {skill.framework}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-primary min-w-[150px]">
                      API & Database
                    </span>
                    <span className="ml-2">: {skill.API_Database}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-primary min-w-[150px]">
                      CI/CD Pipelines
                    </span>
                    <span className="ml-2">: {skill.CI_CD}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-primary min-w-[150px]">
                      Test Management
                    </span>
                    <span className="ml-2">: {skill.test_Management}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold text-primary min-w-[150px]">
                      Dev Skills
                    </span>
                    <span className="ml-2">: {skill.devSkills}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Work Experience</h2>
          <hr />
          <ul className="mt-4 space-y-4">
            {myExp.map((job, index) => (
              <li key={index} className="border-l-4 border-primary pl-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold ">
                    {job.role} - {job.company}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CalendarDays size={16} />
                    {job.duration}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground mt-1 sm:max-w-sm md:min-w-[600px]">
                  {job.project}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Accomplishments Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Key Accomplishments</h2>
          <hr />
          <ul className="mt-4 space-y-4">
            {keyAchivement.map((key, index) => (
              <li key={index} className="border-l-4 border-primary pl-4">
                <p className="text-sm text-muted-foreground">{key}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* My Github Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Github className="text-primary" /> My GitHub Projects
          </h2>
          <hr />
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {myGithub.map((repo, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 border-primary border-l-4"
              >
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="text-primary" size={20} />
                    <h3 className="font-bold text-lg">{repo.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">
                    {repo.description}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                      >
                        <Github size={16} />
                        View on GitHub
                      </Button>
                    </Link>
                    <Link
                      href={repo.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="secondary"
                        className="w-full flex items-center gap-2"
                      >
                        <Globe size={16} />
                        Live Project
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Education</h2>
          <hr />
          <p className="text-sm text-muted-foreground mt-2">
            Batchelors Of Engg From - Gov. College Of Engg. & Research, Awsari
            Pune | 2017
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
