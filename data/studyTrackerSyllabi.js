const DEFAULT_SYLLABUS_DATA = {
  manual: {
    id: "manual",
    label: "Manual Testing",
    icon: "🧪",
    color: "#2563eb",
    sections: [
      {
        id: "manual-s1",
        title: "Fundamentals of Software Testing",
        topics: [
          { id: "m-t1", title: "What is Software Testing?", subtopics: ["Definition & Goals", "Verification vs Validation", "Error, Defect, Failure"], resources: [] },
          { id: "m-t2", title: "Principles of Testing", subtopics: ["7 Principles of Testing", "Early Testing", "Defect Clustering", "Pesticide Paradox"], resources: [] },
          { id: "m-t3", title: "Testing Process & Lifecycle", subtopics: ["STLC Phases", "Entry & Exit Criteria", "Test Planning", "Test Monitoring"], resources: [] },
          { id: "m-t4", title: "Psychology of Testing", subtopics: ["Tester vs Developer Mindset", "Independence of Testing"], resources: [] },
        ],
      },
      {
        id: "manual-s2",
        title: "Testing Types & Levels",
        topics: [
          { id: "m-t5", title: "Levels of Testing", subtopics: ["Unit Testing", "Integration Testing", "System Testing", "Acceptance Testing (UAT)"], resources: [] },
          { id: "m-t6", title: "Functional Testing", subtopics: ["Black Box Testing", "White Box Testing", "Grey Box Testing"], resources: [] },
          { id: "m-t7", title: "Non-Functional Testing", subtopics: ["Performance Testing", "Security Testing", "Usability Testing", "Compatibility Testing"], resources: [] },
          { id: "m-t8", title: "Regression & Retesting", subtopics: ["When to Regress", "Full vs Selective Regression", "Smoke & Sanity Testing"], resources: [] },
          { id: "m-t9", title: "Exploratory Testing", subtopics: ["Session-Based Testing", "Charters", "Mind Maps"], resources: [] },
        ],
      },
      {
        id: "manual-s3",
        title: "Test Design Techniques",
        topics: [
          { id: "m-t10", title: "Equivalence Partitioning", subtopics: ["Valid & Invalid Partitions", "Applying EP to test cases"], resources: [] },
          { id: "m-t11", title: "Boundary Value Analysis", subtopics: ["2-value vs 3-value BVA", "Applying BVA"], resources: [] },
          { id: "m-t12", title: "Decision Table Testing", subtopics: ["Building Decision Tables", "Reducing Tables"], resources: [] },
          { id: "m-t13", title: "State Transition Testing", subtopics: ["State Diagrams", "Transition Coverage"], resources: [] },
          { id: "m-t14", title: "Use Case Testing", subtopics: ["Actors & Scenarios", "Basic & Alternate Flows"], resources: [] },
        ],
      },
      {
        id: "manual-s4",
        title: "Test Documentation",
        topics: [
          { id: "m-t15", title: "Test Plan", subtopics: ["Scope & Objectives", "Resources & Schedule", "Risk Analysis"], resources: [] },
          { id: "m-t16", title: "Test Cases & Test Scripts", subtopics: ["Test Case Structure", "Positive & Negative Cases", "Test Data"], resources: [] },
          { id: "m-t17", title: "Test Scenarios vs Test Cases", subtopics: ["High-level vs Detailed", "Coverage Matrix"], resources: [] },
          { id: "m-t18", title: "Bug Reports & Defect Lifecycle", subtopics: ["Bug Severity & Priority", "Defect States", "Writing Good Bug Reports"], resources: [] },
          { id: "m-t19", title: "Traceability Matrix (RTM)", subtopics: ["Requirement Mapping", "Coverage Analysis"], resources: [] },
        ],
      },
      {
        id: "manual-s5",
        title: "Agile & SDLC Methodologies",
        topics: [
          { id: "m-t20", title: "SDLC Models", subtopics: ["Waterfall", "V-Model", "Iterative & Incremental"], resources: [] },
          { id: "m-t21", title: "Agile Testing", subtopics: ["Scrum Ceremonies", "QA in Sprints", "Definition of Done"], resources: [] },
          { id: "m-t22", title: "Testing in DevOps", subtopics: ["Shift-Left Testing", "Continuous Testing", "Feedback Loops"], resources: [] },
        ],
      },
      {
        id: "manual-s6",
        title: "Test Management & Tools",
        topics: [
          { id: "m-t23", title: "Test Management Tools", subtopics: ["Jira", "TestRail", "Zephyr", "Xray"], resources: [] },
          { id: "m-t24", title: "Bug Tracking Tools", subtopics: ["Jira Workflow", "Bugzilla", "Linear"], resources: [] },
          { id: "m-t25", title: "Test Metrics & Reporting", subtopics: ["Test Coverage", "Defect Density", "Pass/Fail Rate", "Test Progress Report"], resources: [] },
        ],
      },
    ],
  },
  automation: {
    id: "automation",
    label: "Automation Testing",
    icon: "🤖",
    color: "#7c3aed",
    sections: [
      {
        id: "auto-s1",
        title: "Automation Fundamentals",
        topics: [
          { id: "a-t1", title: "When to Automate", subtopics: ["ROI of Automation", "What to Automate vs What Not To", "Automation Pyramid"], resources: [] },
          { id: "a-t2", title: "Automation Frameworks Overview", subtopics: ["Linear", "Modular", "Data-Driven", "Keyword-Driven", "Hybrid", "BDD/TDD"], resources: [] },
          { id: "a-t3", title: "Version Control for QA", subtopics: ["Git Basics", "Branching Strategy", "PR Reviews for Test Code"], resources: [] },
        ],
      },
      {
        id: "auto-s2",
        title: "JavaScript / TypeScript for Testing",
        topics: [
          { id: "a-t4", title: "JS Essentials for QA", subtopics: ["Variables, Functions, Scope", "Promises & Async/Await", "Array Methods", "Destructuring"], resources: [] },
          { id: "a-t5", title: "TypeScript Basics", subtopics: ["Types & Interfaces", "Enums", "Type Guards", "tsconfig setup"], resources: [] },
          { id: "a-t6", title: "Node.js Basics", subtopics: ["npm/yarn", "package.json", "Environment Variables", "Running Scripts"], resources: [] },
        ],
      },
      {
        id: "auto-s3",
        title: "Selenium WebDriver",
        topics: [
          { id: "a-t7", title: "Selenium Architecture", subtopics: ["WebDriver Protocol", "Browser Drivers", "Grid Setup"], resources: [] },
          { id: "a-t8", title: "Locators", subtopics: ["ID, Name, XPath, CSS", "Relative Locators", "Best Practices"], resources: [] },
          { id: "a-t9", title: "WebDriver Actions", subtopics: ["Click, Type, Select", "Drag & Drop", "File Upload", "Scrolling"], resources: [] },
          { id: "a-t10", title: "Waits & Synchronization", subtopics: ["Implicit vs Explicit", "FluentWait", "Custom Wait Conditions"], resources: [] },
          { id: "a-t11", title: "Page Object Model (POM)", subtopics: ["POM Structure", "Page Factory", "Base Page Class"], resources: [] },
          { id: "a-t12", title: "Handling Special Scenarios", subtopics: ["Frames & iFrames", "Windows & Tabs", "Alerts & Popups", "Shadow DOM"], resources: [] },
        ],
      },
      {
        id: "auto-s4",
        title: "Test Frameworks",
        topics: [
          { id: "a-t13", title: "Mocha & Chai", subtopics: ["describe/it blocks", "Hooks", "Assertions", "Reporters"], resources: [] },
          { id: "a-t14", title: "Jest", subtopics: ["Jest Setup", "Mocking", "Snapshot Testing", "Coverage Reports"], resources: [] },
          { id: "a-t15", title: "TestNG / JUnit (Concepts)", subtopics: ["Annotations", "Test Suites", "Parameterization", "Listeners"], resources: [] },
        ],
      },
      {
        id: "auto-s5",
        title: "CI/CD Integration",
        topics: [
          { id: "a-t16", title: "GitHub Actions for QA", subtopics: ["Workflow YAML", "Triggering Tests on PR", "Artifacts & Reports"], resources: [] },
          { id: "a-t17", title: "Jenkins Basics", subtopics: ["Pipeline Setup", "Running Tests", "Notifications"], resources: [] },
          { id: "a-t18", title: "Docker for Test Environments", subtopics: ["Dockerfile for Tests", "Selenium Grid in Docker", "Docker Compose"], resources: [] },
        ],
      },
      {
        id: "auto-s6",
        title: "Reporting & Analysis",
        topics: [
          { id: "a-t19", title: "Allure Reports", subtopics: ["Setup & Configuration", "Annotations", "History & Trends"], resources: [] },
          { id: "a-t20", title: "HTML Reports", subtopics: ["Mochawesome", "Custom Reporters"], resources: [] },
          { id: "a-t21", title: "Test Flakiness Management", subtopics: ["Identifying Flaky Tests", "Retry Strategies", "Root Cause Analysis"], resources: [] },
        ],
      },
    ],
  },
  api: {
    id: "api",
    label: "API Testing",
    icon: "🔌",
    color: "#059669",
    sections: [
      {
        id: "api-s1",
        title: "API Testing Fundamentals",
        topics: [
          { id: "api-t1", title: "REST API Concepts", subtopics: ["HTTP Methods", "Status Codes", "Headers & Auth", "Request/Response Body"], resources: [] },
          { id: "api-t2", title: "SOAP & GraphQL Overview", subtopics: ["SOAP vs REST", "GraphQL Queries & Mutations"], resources: [] },
        ],
      },
      {
        id: "api-s2",
        title: "Postman",
        topics: [
          { id: "api-t3", title: "Postman Basics", subtopics: ["Collections & Environments", "Pre-request Scripts", "Tests Tab"], resources: [] },
          { id: "api-t4", title: "Newman CLI", subtopics: ["Running Collections", "HTML Reporter", "CI Integration"], resources: [] },
        ],
      },
      {
        id: "api-s3",
        title: "API Automation",
        topics: [
          { id: "api-t5", title: "Supertest (Node.js)", subtopics: ["Setup", "Assertions", "Auth Testing"], resources: [] },
          { id: "api-t6", title: "Axios in Tests", subtopics: ["Making Requests", "Interceptors", "Error Handling"], resources: [] },
          { id: "api-t7", title: "Contract Testing", subtopics: ["Pact Framework", "Consumer-Driven Contracts"], resources: [] },
        ],
      },
    ],
  },
  playwright: {
    id: "playwright",
    label: "Playwright",
    icon: "🎭",
    color: "#dc2626",
    sections: [
      {
        id: "pw-s1",
        title: "Playwright Fundamentals",
        topics: [
          { id: "pw-t1", title: "Setup & Configuration", subtopics: ["Installation", "playwright.config.ts", "Browsers & Devices"], resources: [] },
          { id: "pw-t2", title: "Playwright Architecture", subtopics: ["Auto-waiting", "Selectors", "Browser Contexts", "Pages"], resources: [] },
        ],
      },
      {
        id: "pw-s2",
        title: "Core Features",
        topics: [
          { id: "pw-t3", title: "Actions & Assertions", subtopics: ["click, fill, check", "expect() API", "Soft Assertions"], resources: [] },
          { id: "pw-t4", title: "Fixtures & Hooks", subtopics: ["Built-in Fixtures", "Custom Fixtures", "beforeAll/afterEach"], resources: [] },
          { id: "pw-t5", title: "Page Object Model", subtopics: ["POM with Playwright", "Component Objects"], resources: [] },
          { id: "pw-t6", title: "Network Interception", subtopics: ["route.fulfill()", "Mocking APIs", "Request Logging"], resources: [] },
        ],
      },
      {
        id: "pw-s3",
        title: "Advanced Playwright",
        topics: [
          { id: "pw-t7", title: "Visual Testing", subtopics: ["Screenshot Comparison", "toHaveScreenshot()", "Threshold Config"], resources: [] },
          { id: "pw-t8", title: "Tracing & Debugging", subtopics: ["Trace Viewer", "UI Mode", "PWDEBUG"], resources: [] },
          { id: "pw-t9", title: "Parallel Execution", subtopics: ["Workers Config", "Sharding", "Test Grouping"], resources: [] },
          { id: "pw-t10", title: "CI/CD with Playwright", subtopics: ["GitHub Actions", "HTML Reporter", "Allure Integration"], resources: [] },
        ],
      },
    ],
  },
  performance: {
    id: "performance",
    label: "Performance Testing",
    icon: "📊",
    color: "#7c3aed",
    sections: [
      {
        id: "perf-s1",
        title: "Performance Testing Basics",
        topics: [
          { id: "perf-t1", title: "Performance Testing Concepts", subtopics: ["Load Testing", "Stress Testing", "Spike Testing", "Endurance Testing"], resources: [] },
        ],
      },
    ],
  },
};

export default DEFAULT_SYLLABUS_DATA;
