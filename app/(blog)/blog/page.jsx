import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogs } from "@/data/blogs";
import { Clock5 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: `QA PlayGround | Latest Blogs and tutorial with coding examples`,
  description:
    "Boost your automation testing skills with hands-on practice and blogs! Our playground helps improve testing techniques with real-world scenarios.",
  robots: "index, follow",
};

// Category Colors Mapping
export const categoryColors = {
  automation: "bg-blue-500",
  General: "bg-gray-500",
  React: "bg-green-500",
  Testing: "bg-red-500",
  default: "bg-indigo-500",
};

const BlogMainPage = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl pt-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Latest Blog Posts
      </h1>

      {/* Blog Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.slice(0, 10).map((blog) => (
          <div
            key={blog.id}
            className="flex flex-col bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
          >
            {/* Blog Image */}
            <div className="relative h-48 md:h-56 w-full">
              <Image
                src={blog.image}
                alt={blog.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
                priority
              />
            </div>

            {/* Blog Details */}
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {blog.description.slice(0, 120)}...
              </p>

              {/* Meta Info */}
              <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span>By {blog.author || "Random Coders"}</span>
                  <span className="flex items-center">
                    <Clock5 size={14} className="mr-1" />
                    {new Date(blog.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div className="mt-2 flex flex-wrap gap-2">
                {blog.category.map((el, index) => (
                  <Badge
                    key={index}
                    className={`px-2 py-1 rounded text-white text-xs ${
                      categoryColors[el] || categoryColors.default
                    }`}
                  >
                    {el}
                  </Badge>
                ))}
              </div>

              {/* Read More Button */}
              <div className="mt-4">
                <Link href={`${blog.mainPageLink}/${blog.slug}`} prefetch={false}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md">
                    Read More →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogMainPage;
