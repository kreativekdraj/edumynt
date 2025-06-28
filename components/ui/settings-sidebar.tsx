'use client';

import React from 'react';
import { X, User, Palette, Bell, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="public-profile" />
                  <Label htmlFor="public-profile" className="text-sm">Public Profile</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-progress" />
                  <Label htmlFor="show-progress" className="text-sm">Show Learning Progress</Label>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Palette className="h-4 w-4" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="dark-mode" />
                  <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="focus-mode" />
                  <Label htmlFor="focus-mode" className="text-sm">Focus Mode by Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="large-text" />
                  <Label htmlFor="large-text" className="text-sm">Large Text</Label>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="h-4 w-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="email-notifications" defaultChecked />
                  <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="study-reminders" defaultChecked />
                  <Label htmlFor="study-reminders" className="text-sm">Study Reminders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="course-updates" defaultChecked />
                  <Label htmlFor="course-updates" className="text-sm">Course Updates</Label>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4" />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="analytics" defaultChecked />
                  <Label htmlFor="analytics" className="text-sm">Usage Analytics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="ai-training" />
                  <Label htmlFor="ai-training" className="text-sm">AI Training Data</Label>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Account Actions */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}