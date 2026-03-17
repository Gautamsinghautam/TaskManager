import React from 'react'
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, children }) {
  // Ensure children is an array
  const childrenArray = React.Children.toArray(children).filter(child => child);
  
  return (
    <div className="w-full">
      <TabGroup>
        <TabList className="flex gap-6 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab, index) => (
            <Tab
              key={index + tab.title}
              className={({ selected }) =>
                classNames(
                  "px-3 py-2.5 text-base font-medium outline-none transition whitespace-nowrap",
                  selected
                    ? "text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-800"
                )
              }
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                <span>{tab.title}</span>
              </div>
            </Tab>
          ))}
        </TabList>

        <TabPanels className="mt-6">
          {childrenArray.map((child, index) => (
            <TabPanel key={index} className="outline-none">
              {child}
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}