"use client";

import { Button } from "@/components/ui/button";
import {ModeToggle} from "@/components/ui/ThemeToggler"; 

// Import ThemeGoggler

interface NavBarProps {
  userName?: string | null;
  onSignOut: () => void;
}

export default function NavBar({ userName, onSignOut }: NavBarProps) {


  
  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
            <ModeToggle /> {/* Add ThemeGoggler here */}
            </div>
           
            {userName && (
              <>
                <span className="text-gray-600 mr-4 dark:text-white">Welcome, {userName}</span>
                <Button onClick={onSignOut} variant="outline">Sign Out</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}