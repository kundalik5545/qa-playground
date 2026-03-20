# AI Agent Rules for QA Testing Playground Codebase

## Overview

This document provides comprehensive rules and guidelines for AI agents to understand, navigate, and work with the QA Testing Playground codebase effectively.

## Project Architecture

### Framework & Technology Stack

- **Framework**: Next.js 15.1.2 with React 19.1.0
- **Styling**: Tailwind CSS with custom components
- **UI Library**: Radix UI components with shadcn/ui
- **Theme**: Next-themes for dark/light mode
- **Content**: Markdown files processed with unified/remark/rehype
- **Icons**: Lucide React icons
- **Deployment**: Vercel with sitemap generation

### Project Structure Rules

#### 1. Route Groups & Layouts

```
app/
├── layout.js                 # Root layout with theme provider, header, footer
├── page.js                   # Homepage with hero section
├── (admin)/                  # Admin route group
│   ├── layout.js            # Admin-specific layout
│   ├── about-us/page.jsx    # About us page
│   ├── about-me/page.jsx    # Developer profile page
│   ├── contact-us/          # Contact page
│   └── privacy-policy/      # Privacy policy page
├── (blog)/                  # Blog route group
│   └── blog/               # Blog listing page
└── (Practice)/             # Practice route group
    ├── layout.js           # Practice-specific layout
    ├── learn/              # Learning content
    │   ├── [slug]/         # Dynamic learning pages
    │   └── _components/    # Learning-specific components
    └── practice/           # Practice exercises
        ├── [slug]/         # Dynamic practice pages
        └── _components/    # Practice-specific components
```

**Rule**: Always respect route group naming conventions. Admin pages use (admin), blog pages use (blog), and practice/learning pages use (Practice).

#### 2. Component Architecture

```
components/
├── Header.jsx              # Main navigation header
├── hero.jsx               # Landing page hero section
├── NavbarSheet.jsx        # Mobile navigation drawer
├── lib/                   # Utility components
│   ├── Footer.jsx         # Site footer
│   ├── FooterLinks.jsx    # Footer navigation links
│   ├── Mode-toggle.jsx    # Theme toggle button
│   ├── SocialShare.jsx    # Social sharing component
│   └── theme-provider.jsx # Theme context provider
└── ui/                    # Reusable UI components (shadcn/ui)
    ├── button.jsx         # Button variants
    ├── card.jsx           # Card components
    ├── input.jsx          # Input field variants
    ├── select.jsx         # Dropdown components
    └── ...                # Other UI primitives
```

**Rule**: All UI components follow the shadcn/ui pattern with Radix UI primitives. Custom components go in `/components`, utility components in `/components/lib`, and base UI components in `/components/ui`.

#### 3. Data Management

```
data/
├── BasicSetting.js        # Site configuration and metadata
├── blogs.js              # Blog post configurations
├── elementsTestCases.js   # Test case data for elements
├── formsTestCases.js     # Test case data for forms
├── landingPage.js        # Landing page content data
└── sitemap-links.js      # Sitemap generation data
```

**Rule**: All configuration and static data must be stored in the `/data` directory. Use JavaScript modules for easy imports and type safety.

## Content Management Rules

### 1. Blog Content Structure

- **Location**: `/Blog` directory with subdirectories for categories
- **Format**: Markdown files with frontmatter
- **Categories**:
  - `AutomationBlog/` - General automation testing content
  - `ElementBlogs/` - Element-specific tutorials and guides

**Rule**: All blog content must include proper frontmatter with title, description, date, author, and category fields.

### 2. Practice Component Pattern

Each practice component follows this standard structure:

```jsx
const ComponentPage = () => {
  const youtubeLink = ""; // YouTube tutorial link

  return (
    <div className="pt-2">
      <div className="flex flex-col sm:flex-row w-full gap-4">
        {/* Main Practice Section - 2/3 width */}
        <div className="w-full sm:w-2/3 pb-5 md:pb-0">
          <Card className="w-full shadow-lg rounded-xl dark:bg-gray-800">
            <CardContent className="space-y-4 pt-4 sm:pt-3">
              <QAPlayGround /> {/* Practice exercises */}
            </CardContent>
          </Card>
        </div>

        {/* Insight Section - 1/3 width */}
        <div className="w-full sm:w-1/3">
          <Card className="w-full shadow-lg rounded-xl dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <p className="text-lg font-semibold">Insight</p>
              <GraduationCap className="text-gray-700 dark:text-teal-300" />
            </CardHeader>
            <CardContent>
              <LearningInsight /> {/* Learning objectives */}
            </CardContent>
            <CardFooter>
              <Link href={youtubeLink}>Watch tutorial</Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Required sub-components
const QAPlayGround = () => {
  // Interactive practice elements
};

const LearningInsight = () => {
  // Learning objectives and concepts
};
```

**Rule**: All practice components must follow this exact structure with QAPlayGround and LearningInsight sub-components.

## Development Rules

### 1. Styling Guidelines

- **Primary Framework**: Tailwind CSS
- **Color Scheme**: Support for light/dark themes
- **Responsive Design**: Larger screen than mobile approach with sm:, md:, lg: breakpoints
- **Component Variants**: Use class-variance-authority for component variants

**Rule**: Always use Tailwind classes. Custom CSS should be minimal and only for complex animations or layouts not achievable with Tailwind.

### 2. Component Import Rules

```javascript
// UI Components (from shadcn/ui)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Custom Components
import Header from "@/components/Header";
import { basicDetails } from "@/data/BasicSetting";

// Icons
import { GraduationCap, Calendar } from "lucide-react";

// Next.js
import Link from "next/link";
import Image from "next/image";
```

**Rule**: Use absolute imports with `@/` prefix. Group imports by category: UI components, custom components, data, icons, Next.js components.

### 3. SEO and Metadata Rules

```javascript
export const metadata = {
  title: "Page Title - QA PlayGround",
  description: "Comprehensive description for SEO",
  alternates: {
    canonical: `${basicDetails.websiteURL}/page-slug`,
  },
};
```

**Rule**: Every page must export metadata object with proper SEO fields. Use basicDetails.websiteURL for canonical URLs.

### 4. Dynamic Routing Rules

- **Practice Pages**: Use `[slug]/page.jsx` with `generateStaticParams()`
- **Blog Pages**: Use `[slug]/page.jsx` with markdown file processing
- **Component Mapping**: Create componentMapping object for dynamic component rendering

```javascript
const componentMapping = {
  "page-slug": ComponentName,
  // ... other mappings
};
```

**Rule**: Always implement generateStaticParams() for dynamic routes and use component mapping for dynamic component rendering.

## Testing & Quality Rules

### 1. Automation Testing Elements

Each practice page should include:

- **Testable Elements**: Buttons, inputs, selects, tables, forms
- **Element Attributes**: Proper id, name, data-testid attributes for automation
- **Learning Objectives**: Clear list of automation concepts covered
- **Tutorial Links**: YouTube tutorial references where available

**Rule**: All interactive elements must have appropriate attributes for automation testing tools (Selenium, Cypress, Playwright).

### 2. Accessibility Rules

- Use semantic HTML elements
- Include proper ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Use alt text for images

**Rule**: All components must be accessible and follow WCAG guidelines.

## File Naming Conventions

### 1. Component Files

- **React Components**: PascalCase with `.jsx` extension
- **Page Components**: `page.jsx` or `page.js`
- **Layout Components**: `layout.js`
- **Data Files**: camelCase with `.js` extension

### 2. Directory Structure

- **Route Groups**: Wrapped in parentheses `(groupName)`
- **Dynamic Routes**: Wrapped in brackets `[slug]`
- **Private Components**: Prefix with underscore `_components`

**Rule**: Follow Next.js 13+ App Router conventions strictly.

## Performance Rules

### 1. Image Optimization

- Use Next.js `Image` component for all images
- Store images in `/public` directory
- Optimize image sizes and formats

### 2. Code Splitting

- Use dynamic imports for large components
- Implement lazy loading where appropriate
- Minimize bundle sizes

**Rule**: Always optimize for performance and Core Web Vitals.

## Content Creation Rules

### 1. Blog Posts

When creating new blog content:

- Add markdown file to appropriate `/Blog` subdirectory
- Include proper frontmatter
- Update `blogs.js` configuration if needed
- Add to sitemap configuration

### 2. Practice Exercises

When adding new practice exercises:

- Create component in `_components` directory
- Add to `componentMapping` in dynamic route
- Update navigation data
- Include proper learning insights

**Rule**: All new content must follow established patterns and be properly integrated into the navigation system.

## Error Handling Rules

### 1. Page Not Found

- Use Next.js `notFound()` function for missing content
- Implement proper 404 handling in dynamic routes

### 2. Error Boundaries

- Wrap components in error boundaries where appropriate
- Provide meaningful error messages

**Rule**: Always handle errors gracefully and provide user-friendly feedback.

## Security Rules

### 1. External Links

- Use `rel="noopener noreferrer"` for external links
- Implement proper CSP headers where needed

### 2. Data Validation

- Validate all user inputs
- Sanitize markdown content properly

**Rule**: Security should be considered in all implementations.

---

## Quick Reference for AI Agents

### Common Tasks:

1. **Adding a new practice exercise**: Create component in `_components`, add to mapping, update navigation
2. **Creating a blog post**: Add markdown file, update configuration, regenerate sitemap
3. **Modifying UI**: Check `components/ui` for existing components, follow Tailwind patterns
4. **Updating site configuration**: Modify files in `/data` directory
5. **Adding new routes**: Follow Next.js App Router conventions with proper layouts

### Key Files to Understand:

- `/app/layout.js` - Root layout and global configuration
- `/data/BasicSetting.js` - Site-wide configuration
- `/components/Header.jsx` - Main navigation
- `/app/(Practice)/practice/[slug]/page.jsx` - Dynamic practice page routing
- `/package.json` - Dependencies and scripts

This documentation ensures consistent development practices and helps AI agents understand the codebase architecture effectively.
