import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const allElements = [
  {
    title: "POM",
    logo: "/mainicons/edit.svg",
    Description: "Practice Page Object Model with fake bank",
    footerTitle: "Page Object Model",
    link: "/bank",
  },
  {
    title: "Input",
    logo: "/mainicons/edit.svg",
    Description: "Interact with different types of input fields",
    footerTitle: "Edit",
    link: "/practice/input",
  },
  {
    title: "Button",
    logo: "/mainicons/buttons.svg",
    Description: "Interact with different types of buttons",
    footerTitle: "Click",
    link: "/practice/button",
  },
  {
    title: "Select",
    logo: "/mainicons/select.svg",
    Description: "Interact with different types of drop-down",
    footerTitle: "Select By",
    link: "/practice/select",
  },
  {
    title: "Links",
    logo: "/mainicons/edit.svg",
    Description: "Interact with different types of links",
    footerTitle: "On Click",
    link: "/practice/links",
  },
  {
    title: "Alert",
    logo: "/mainicons/alert.svg",
    Description: "Interact with different types of dialog boxes",
    footerTitle: "Dialog",
    link: "/practice/alert",
  },
  {
    title: "Radio",
    logo: "/mainicons/radio.svg",
    Description: "Interact with different types of radio & check boxes",
    footerTitle: "Toggle",
    link: "/practice/radio",
  },
  {
    title: "Window",
    logo: "/mainicons/window.svg",
    Description: "Switch different types of tabs or windows",
    footerTitle: "Tabs",
    link: "/practice/window",
  },
  // {
  //   title: "Elements",
  //   logo: "/mainicons/elements.svg",
  //   Description: "Play with element and smash them",
  //   footerTitle: "Find Elements",
  //   link: "/practice/elements",
  // },
  // {
  //   title: "Drag",
  //   logo: "/mainicons/drag.svg",
  //   Description: "Can you Drag me here and there",
  //   footerTitle: "Just Drag",
  //   link: "/practice/drag",
  // },
  // {
  //   title: "Drop",
  //   logo: "/mainicons/falling.svg",
  //   Description: "Feel free to bounce me",
  //   footerTitle: "Drop Me",
  //   link: "/practice/drop",
  // },
  // {
  //   title: "Sort",
  //   logo: "/mainicons/filter.svg",
  //   Description: "Sort out the problem quickly",
  //   footerTitle: "Sort out",
  //   link: "/practice/sort",
  // },
  {
    title: "Multi-Select",
    logo: "/mainicons/alert.svg",
    Description: "Be a multi-tasker",
    footerTitle: "Page",
    link: "/practice/multi-select",
  },
  // {
  //   title: "Slider",
  //   logo: "/mainicons/slider.svg",
  //   Description: "Hmm.. Can you slide me?",
  //   footerTitle: "Page",
  //   link: "/practice/slider",
  // },
  {
    title: "Waits",
    logo: "/mainicons/waits.svg",
    Description: "It's ok to wait but you know..",
    footerTitle: "Timeout",
    link: "/practice/waits",
  },
  {
    title: "Table",
    logo: "/mainicons/simtable.svg",
    Description: "It's all about rows & columns",
    footerTitle: "Simple Table",
    link: "/practice/simple-table",
  },
  // {
  //   title: "Table",
  //   logo: "/mainicons/simtable.svg",
  //   Description: "It's little complicated but give a try",
  //   footerTitle: "Advance Table",
  //   link: "/practice/advance-table",
  // },
  // {
  //   title: "Advance Table",
  //   logo: "/mainicons/simtable.svg",
  //   Description: "It's little complicated but give a try",
  //   footerTitle: "Advance Table",
  //   link: "/practice/advance-table",
  // },
  {
    title: "Calendar",
    logo: "/mainicons/calendar.svg",
    Description: "My time is precious & your?",
    footerTitle: "Date & Time",
    link: "/practice/calendar",
  },
  {
    title: "Forms",
    logo: "/mainicons/sign-form.svg",
    Description: "Interact with everything",
    footerTitle: "Submit Me",
    link: "/practice/forms",
  },
  {
    title: "File",
    logo: "/mainicons/download.svg",
    Description: "All your data is secured!",
    footerTitle: "Upload & Download",
    link: "/practice/upload-download",
  },
  // {
  //   title: "Shadow",
  //   logo: "/mainicons/mario.svg",
  //   Description: "Shadow never leaves us alone",
  //   footerTitle: "DOM",
  //   link: "/practice/shadow-dom",
  // },
];

const PracticePage = () => {
  return (
    <div>
      <div className="practice-section">
        <section className="page-title py-4">
          <h1 className="text-center text-3xl font-semibold">
            Ready to be a Pro Ai Automation Enginner?
          </h1>
          <h2 className="text-center text-base mt-2 text-gray-500 ">
            Practice daily and level up your automation skills with real-world
            scenarios.
          </h2>
        </section>
        <section className="elements grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-0 gap-8 pt-8 p-5 ">
          {allElements?.map((el, i) => {
            return (
              <Card
                key={i}
                className="h-56 transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                <CardHeader className="flex flex-row items-center justify-between p-1 shadow-lg dark:shadow-md dark:shadow-gray-800  space-y-0">
                  <p className="px-2 text-xl font-semibold">{el.title}</p>
                  <Image
                    src={el.logo}
                    width={50}
                    height={50}
                    className="p-1"
                    alt={el.title}
                  />
                </CardHeader>
                <CardContent className="p-3 h-28">
                  <p className="py-7 text-base dark:text-gray-200 text-center">
                    {el.Description}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center p-2 border-t ">
                  <Link href={el.link}>
                    <span className="underline text-blue-600 dark:text-teal-200 font-light">
                      {el.footerTitle}
                    </span>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default PracticePage;
