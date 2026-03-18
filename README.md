# QA Testing Playground

This project aims to help new automation test engineers practice automation testing with different web elements.

## Getting Started

### Prerequisites

- Web browser (Chrome, Firefox, Safari)
- Basic understanding of web automation tools like Selenium, Cypress, or Playwright

### Accessing the Application

1. Visit the QA Playground at [https://qaplayground.com](https://qaplayground.com)
2. No login required - the application is free to use

## Features

The playground includes various test scenarios for practicing:

- It covers all basic and advance html elements
- You can practice based on elements you like
- Form submissions
- Dynamic elements
- AJAX requests
- Tables and data grids
- Drag and drop operations
- iFrames
- Alerts and popups

## How to Use

1. Navigate to the desired test scenario using the main menu
2. Each section contains information about the elements and expected behaviors
3. Use your automation tool to interact with the elements
4. Check your test results against the expected outcomes

## Examples

```csharp
// Simple C#/Selenium example
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

IWebDriver driver = new ChromeDriver();
driver.Navigate().GoToUrl("https://qaplayground.com");
IWebElement button = driver.FindElement(By.XPath("//h1"));
button.Click();
```

## For Developers & AI Agents

### Codebase Understanding

This project includes comprehensive documentation for AI agents and developers:

- **`AI_CODING_GUIDELINES.md`** - Detailed rules and patterns for understanding the codebase architecture
- **`.ai-project-config.json`** - Machine-readable configuration for automated code analysis
- **Component Patterns** - Standardized structure for practice components and pages
- **Routing Convention** - Next.js App Router with route groups and dynamic routing

### Key Architecture Points

- **Framework**: Next.js 15.1.2 with App Router
- **UI**: Tailwind CSS + Radix UI + shadcn/ui components
- **Content**: Markdown-based blog system with frontmatter
- **Structure**: Route groups for organization (admin, blog, practice)
- **Testing Focus**: Interactive elements designed for automation testing practice

### Development Guidelines

All components follow established patterns documented in `AI_CODING_GUIDELINES.md`. When contributing:

1. Follow the component structure patterns
2. Use Tailwind CSS for styling
3. Maintain accessibility standards
4. Include proper SEO metadata
5. Test with automation tools in mind

## Contributing

If you'd like to contribute additional test scenarios, please submit a pull request.

## Support

If you encounter any issues, please open a ticket in the Issues section of this repository.
