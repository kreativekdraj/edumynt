import React from 'react';
import { X, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="flex flex-col items-center gap-2 h-auto py-3"
                  >
                    <Sun className="h-4 w-4" />
                    <span className="text-xs">Light</span>
                  </Button>
                  
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="flex flex-col items-center gap-2 h-auto py-3"
                  >
                    <Moon className="h-4 w-4" />
                    <span className="text-xs">Dark</span>
                  </Button>
                  
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('system')}
                    className="flex flex-col items-center gap-2 h-auto py-3"
                  >
                    <Monitor className="h-4 w-4" />
                    <span className="text-xs">System</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Other Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Notifications</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Language</span>
                  <Button variant="outline" size="sm">English</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Font Size</span>
                  <Button variant="outline" size="sm">Medium</Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Profile</span>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Privacy</span>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Data Export</span>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}