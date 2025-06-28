'use client';

import React from 'react';
import { X, Monitor, Moon, Sun, User, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Switch } from './switch';
import { Label } from './label';
import { Separator } from './separator';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 z-50 h-full w-80 bg-white dark:bg-gray-900 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Theme Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Appearance</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                    ${theme === 'light' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  <Sun className="h-4 w-4" />
                  <span className="text-sm">Light</span>
                </button>
                
                <button
                  onClick={() => setTheme('dark')}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                    ${theme === 'dark' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  <Moon className="h-4 w-4" />
                  <span className="text-sm">Dark</span>
                </button>
                
                <button
                  onClick={() => setTheme('system')}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                    ${theme === 'system' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  <Monitor className="h-4 w-4" />
                  <span className="text-sm">System</span>
                </button>
              </div>
            </div>

            <Separator />

            {/* Notifications */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <Label htmlFor="push-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Push Notifications
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get notified about new lessons</p>
                    </div>
                  </div>
                  <Switch id="push-notifications" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <Label htmlFor="email-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Notifications
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Weekly progress updates</p>
                    </div>
                  </div>
                  <Switch id="email-notifications" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Account */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Account</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Profile Settings</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Privacy & Security</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <HelpCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Help & Support</span>
                </button>
              </div>
            </div>

            <Separator />

            {/* Sign Out */}
            <button className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}