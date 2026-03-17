import React from 'react'
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, children }) {
  return (
    <div className="w-full px-1 gap-6 sm:px-0">
      <TabGroup>
        <TabList className="flex gap-6 rounded-xl p-1">
          {tabs.map((tab, index) => (
            <Tab
              key={index + tab.title}
              className={({ selected }) =>
                classNames(
                  "w-fit flex items-center outline-none gap-2 px-3 py-2.5 text-base font-medium bg-white",
                  selected
                    ? "text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-800 hover:text-blue-800"
                )
              }
            >
              {tab.icon}
              <span>{tab.title}</span>
            </Tab>
          ))}
        </TabList>

        <TabPanels className="mt-4">
          {children}
        </TabPanels>
      </TabGroup>
    </div>
  );
}