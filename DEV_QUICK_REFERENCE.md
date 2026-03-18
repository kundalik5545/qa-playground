# Quick Reference for AI Agents - QA Testing Playground

## 🚀 Project Overview

**QA Testing Playground** - Next.js 15 educational platform for automation testing practice

## 📁 Key Directories

```
app/                    # Next.js App Router pages
├── (admin)/           # Admin pages (about, contact, privacy)
├── (blog)/            # Blog listing and posts
└── (Practice)/        # Practice exercises and learning content

components/            # React components
├── ui/               # Base UI components (shadcn/ui)
└── lib/              # Utility components

data/                  # Configuration and static data
Blog/                  # Markdown blog content
public/               # Static assets (images, icons, docs)
```

## 🔧 Tech Stack

- **Framework**: Next.js 15.1.2 + React 19.1.0
- **Styling**: Tailwind CSS
- **UI Library**: Radix UI + shadcn/ui
- **Content**: Markdown with unified/remark/rehype
- **Icons**: Lucide React
- **Theme**: next-themes (dark/light mode)

## 📋 Component Patterns

### Practice Component Structure

```jsx
const ComponentPage = () => (
  <div className="pt-2">
    <div className="flex flex-col sm:flex-row w-full gap-4">
      {/* Main Practice (2/3 width) */}
      <div className="w-full sm:w-2/3">
        <Card>
          <CardContent>
            <QAPlayGround />
          </CardContent>
        </Card>
      </div>

      {/* Insight Section (1/3 width) */}
      <div className="w-full sm:w-1/3">
        <Card>
          <CardHeader>Insight</CardHeader>
          <CardContent>
            <LearningInsight />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
```

### Page Metadata Template

```jsx
export const metadata = {
  title: "Page Title - QA PlayGround",
  description: "SEO description",
  alternates: {
    canonical: `${basicDetails.websiteURL}/page-slug`,
  },
};
```

## 🛠️ Common Tasks

### Adding New Practice Exercise

1. Create component in `app/(Practice)/practice/_components/`
2. Add to `componentMapping` in `[slug]/page.jsx`
3. Update navigation data if needed
4. Follow standard practice component structure

### Adding Blog Post

1. Create `.md` file in appropriate `Blog/` subdirectory
2. Include proper frontmatter (title, description, date, author)
3. Update `data/blogs.js` if needed
4. Component will be auto-generated via slug routing

### Modifying UI Components

- Check `components/ui/` for existing components
- Use Tailwind CSS classes
- Follow responsive design patterns (mobile-first)
- Maintain dark/light theme support

## 📖 Import Patterns

```jsx
// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Custom Components
import Header from "@/components/Header";

// Data
import { basicDetails } from "@/data/BasicSetting";

// Icons
import { GraduationCap } from "lucide-react";

// Next.js
import Link from "next/link";
import Image from "next/image";
```

## 🎯 Automation Testing Focus

### Interactive Elements

Each practice page includes:

- **Buttons**: Various types and states
- **Forms**: Input fields, selects, checkboxes, radio buttons
- **Tables**: Static and dynamic data tables
- **Alerts**: JavaScript alerts and confirmations
- **File Operations**: Upload/download functionality
- **Dynamic Content**: AJAX requests and updates

### Testing Attributes

All interactive elements include:

- `id` attributes for unique identification
- `name` attributes for form elements
- `data-testid` for automation testing
- Semantic HTML for accessibility

## 🚦 Development Rules

### File Naming

- Components: `PascalCase.jsx`
- Pages: `page.jsx` or `page.js`
- Layouts: `layout.js`
- Data files: `camelCase.js`

### Styling Guidelines

- Use Tailwind CSS exclusively
- Mobile-first responsive design
- Support dark/light themes
- Follow accessibility standards

### Performance

- Use Next.js `Image` component for images
- Implement proper loading states
- Optimize bundle sizes
- Follow Core Web Vitals guidelines

## 📚 Key Configuration Files

- `data/BasicSetting.js` - Site-wide configuration
- `tailwind.config.mjs` - Tailwind customization
- `next.config.mjs` - Next.js configuration
- `package.json` - Dependencies and scripts

## 🔍 Quick Debugging

1. **Layout Issues**: Check responsive classes and flexbox structure
2. **Theme Problems**: Verify dark: prefixes and theme provider setup
3. **Routing Issues**: Confirm file structure matches App Router conventions
4. **Component Errors**: Ensure proper imports and prop passing

## 📞 Need Help?

- Check `AI_CODING_GUIDELINES.md` for comprehensive documentation
- Review `.ai-project-config.json` for technical specifications
- Examine existing components for patterns and examples
- Test changes across different screen sizes and themes

---

_Last updated: October 2025 | For QA Testing Playground v0.1.0_
