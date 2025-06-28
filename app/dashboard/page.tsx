'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  BookOpen, 
  Menu, 
  Home, 
  GraduationCap, 
  FileText, 
  MessageCircle, 
  User as UserIcon,
  Play,
  Clock,
  TrendingUp,
  Brain,
  Calendar,
  Users,
  ChevronRight,
  Star,
  Target,
  Award,
  Settings,
  ChevronLeft,
  Eye,
  Lock,
  CheckCircle,
  Calculator,
  Lightbulb,
  Zap
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';
import { 
  getPublishedCourses, 
  getUserEnrolledCourses, 
  enrollUserInCourse,
  type Course,
  type UserCourseEnrollment 
} from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { SettingsSidebar } from '@/components/ui/settings-sidebar';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<UserCourseEnrollment[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', containScroll: 'trimSnaps' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle URL parameters for tab switching
  useEffect(() => {
    if (!mounted) return;
    
    const tab = searchParams.get('tab');
    if (tab && ['home', 'courses', 'tests', 'discuss', 'profile'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (!user) {
          router.replace('/auth/signin');
          return;
        }
      } catch (error) {
        console.error('Error getting user:', error);
        router.replace('/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.replace('/auth/signin');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, mounted]);

  useEffect(() => {
    if (!user || !mounted) return;
    
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const [allCourses, userEnrollments] = await Promise.all([
          getPublishedCourses(),
          getUserEnrolledCourses(user.id)
        ]);
        
        setCourses(allCourses);
        setEnrolledCourses(userEnrollments);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [user, mounted]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEnrollInCourse = async (courseId: string) => {
    if (!user) return;
    
    const success = await enrollUserInCourse(user.id, courseId);
    if (success) {
      // Refresh enrolled courses
      const userEnrollments = await getUserEnrolledCourses(user.id);
      setEnrolledCourses(userEnrollments);
    }
  };

  const handleContinueCourse = (courseId: string) => {
    // Navigate to the course details page
    router.push(`/course/${courseId}`);
  };

  const getFirstLessonOfCourse = async (courseId: string) => {
    try {
      const { data: lessons, error } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })
        .limit(1);

      if (error || !lessons || lessons.length === 0) {
        return null;
      }

      return lessons[0].id;
    } catch (error) {
      console.error('Error fetching first lesson:', error);
      return null;
    }
  };

  const handleStartLearning = async (courseId: string) => {
    const firstLessonId = await getFirstLessonOfCourse(courseId);
    if (firstLessonId) {
      router.push(`/lesson/${firstLessonId}`);
    } else {
      // Fallback to course page
      router.push(`/course/${courseId}`);
    }
  };

  // Navigation items for desktop top bar and mobile bottom bar
  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'courses', label: 'Courses', icon: GraduationCap },
    { id: 'tests', label: 'Tests', icon: FileText },
    { id: 'discuss', label: 'Discuss', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  // Sidebar navigation items with sections for a more native feel
  const sidebarSections = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', icon: Home, active: activeTab === 'home' },
        { label: 'My Courses', icon: GraduationCap, active: activeTab === 'courses' },
        { label: 'Practice Tests', icon: FileText, active: activeTab === 'tests' },
      ]
    },
    {
      title: 'Community',
      items: [
        { label: 'Discussion', icon: MessageCircle, active: activeTab === 'discuss' },
        { label: 'Leaderboard', icon: TrendingUp, active: false },
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Profile', icon: UserIcon, active: activeTab === 'profile' },
        { label: 'Settings', icon: Settings, active: false },
      ]
    }
  ];

  // Show loading skeleton while mounting or loading user
  if (!mounted || loading) {
    return <DashboardSkeleton />;
  }

  // Redirect if no user (this should be handled by useEffect, but just in case)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar and Top Bar Container */}
      <div className="lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:h-full lg:flex-1 lg:flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Edumynt</span>
            </div>
          </div>
          <nav className="flex-1 flex flex-col overflow-y-auto py-4 px-2">
            {sidebarSections.map((section, index) => (
              <div key={section.title} className={index > 0 ? 'mt-6' : ''}>
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => {
                          if (item.label === 'Settings') {
                            setSettingsOpen(true);
                          } else if (item.label === 'Dashboard') {
                            setActiveTab('home');
                          } else if (item.label === 'My Courses') {
                            setActiveTab('courses');
                          } else if (item.label === 'Practice Tests') {
                            setActiveTab('tests');
                          } else if (item.label === 'Discussion') {
                            setActiveTab('discuss');
                          } else if (item.label === 'Profile') {
                            setActiveTab('profile');
                          }
                        }}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                          item.active
                            ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-400 font-medium'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Desktop Top Bar - now part of the fixed container */}
        <div className="hidden lg:block sticky top-0 z-40 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-end h-16 px-4">
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                      : 'text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-2 ${activeTab === item.id ? 'scale-110' : ''} transition-transform`} />
                  <span>{item.label}</span>
                </button>
              ))}
              
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 mx-2"></div>
              
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 px-6 py-6 shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Edumynt</span>
            </div>
            <nav>
              <ul className="space-y-1">
                {sidebarSections.map((section) => (
                  <React.Fragment key={section.title}>
                    <li className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </li>
                    {section.items.map((item) => (
                      <li key={item.label}>
                        <button
                          onClick={() => {
                            setSidebarOpen(false);
                            if (item.label === 'Settings') {
                              setSettingsOpen(true);
                            } else if (item.label === 'Dashboard') {
                              setActiveTab('home');
                            } else if (item.label === 'My Courses') {
                              setActiveTab('courses');
                            } else if (item.label === 'Practice Tests') {
                              setActiveTab('tests');
                            } else if (item.label === 'Discussion') {
                              setActiveTab('discuss');
                            } else if (item.label === 'Profile') {
                              setActiveTab('profile');
                            }
                          }}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors w-full text-left ${
                            item.active
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700'
                          }`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </React.Fragment>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Settings Sidebar */}
      <SettingsSidebar 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar with navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-4">
          {/* Mobile menu button and title */}
          <div className="flex items-center lg:hidden w-full">
            <button
              type="button"
              className="p-2 -ml-2 text-gray-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Center the title on mobile */}
            <div className="flex-1 text-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">EDUMYNT</span>
            </div>
            
            {/* Settings button on mobile */}
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop navigation - horizontal layout */}
          <div className="hidden lg:flex lg:items-center lg:flex-1 lg:justify-end">
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                      : 'text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-2 ${activeTab === item.id ? 'scale-110' : ''} transition-transform`} />
                  <span>{item.label}</span>
                </button>
              ))}
              
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 mx-2"></div>
              
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="py-6 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-6">
          {activeTab === 'home' && <HomeContent enrolledCourses={enrolledCourses} coursesLoading={coursesLoading} onContinueCourse={handleContinueCourse} onStartLearning={handleStartLearning} />}
          {activeTab === 'courses' && <CoursesContent courses={courses} enrolledCourses={enrolledCourses} onEnroll={handleEnrollInCourse} coursesLoading={coursesLoading} onContinueCourse={handleContinueCourse} />}
          {activeTab === 'tests' && <TestsContent />}
          {activeTab === 'discuss' && <DiscussContent />}
          {activeTab === 'profile' && <ProfileContent user={user} onSignOut={handleSignOut} />}
        </main>
      </div>

      {/* Bottom navigation (mobile only) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                activeTab === item.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeContent({ enrolledCourses, coursesLoading, onContinueCourse, onStartLearning }: { 
  enrolledCourses: UserCourseEnrollment[], 
  coursesLoading: boolean,
  onContinueCourse: (courseId: string) => void,
  onStartLearning: (courseId: string) => void
}) {
  const [emblaRef] = useEmblaCarousel({ 
    loop: false, 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const renderCourseCard = (enrollment: UserCourseEnrollment) => {
    const subject = enrollment.course?.subject?.toLowerCase() || '';
    let icon = <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    let bgColor = 'bg-gray-100 dark:bg-gray-900/30';
    
    if (subject.includes('english')) {
      icon = <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />;
      bgColor = 'bg-green-100 dark:bg-green-900/30';
    } else if (subject.includes('psychology')) {
      icon = <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      bgColor = 'bg-purple-100 dark:bg-purple-900/30';
    } else if (subject.includes('math')) {
      bgColor = 'bg-blue-100 dark:bg-blue-900/30';
    }

    return (
      <div key={enrollment.id} className="flex-[0_0_280px] min-w-0 h-full">
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
          <CardContent className="p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${bgColor} flex-shrink-0`}>
                {icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{enrollment.course?.title || 'Untitled Course'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{enrollment.course?.subject || 'General'}</p>
              </div>
            </div>
            <div className="mt-auto">
              <Progress value={enrollment.progress || 0} className="mb-3" />
              <Button 
                size="sm" 
                className="w-full mt-auto"
                onClick={() => onContinueCourse(enrollment.course_id)}
              >
                Continue Learning
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-blue-100 mb-4">Ready to continue your learning journey?</p>
        <Button 
          className="bg-white text-blue-600 hover:bg-blue-50"
          onClick={() => {
            if (enrolledCourses.length > 0) {
              onStartLearning(enrolledCourses[0].course_id);
            }
          }}
        >
          <Play className="h-4 w-4 mr-2" />
          Resume Learning
        </Button>
      </div>

      {/* Resume Learning Carousel */}
      <section className="relative">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Continue Learning</h2>
        {coursesLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2].map((i) => (
              <div key={i} className="flex-[0_0_280px] min-w-0">
                <Card className="h-full">
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Skeleton className="h-2 w-full mb-3" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : enrolledCourses.length > 0 ? (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 pb-4">
              {enrolledCourses.map(renderCourseCard)}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No courses in progress</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Start learning by enrolling in a course</p>
              <Button size="sm">Browse Courses</Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-fit mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Score</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-fit mx-auto mb-2">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Day Streak</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-fit mx-auto mb-2">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5h</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full w-fit mx-auto mb-2">
                <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Badges</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Available Tests */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Practice Tests</h2>
          <Button variant="ghost" size="sm">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">English Mock Test #3</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">50 questions • 60 minutes</p>
                  </div>
                </div>
                <Button size="sm">Start Test</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Psychology Quick Quiz</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">20 questions • 30 minutes</p>
                  </div>
                </div>
                <Button size="sm">Start Test</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Study Notes</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Study Planner</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">AI Tutor</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Community</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function CoursesContent({ courses, enrolledCourses, onEnroll, coursesLoading, onContinueCourse }: { 
  courses: Course[], 
  enrolledCourses: UserCourseEnrollment[], 
  onEnroll: (courseId: string) => void,
  coursesLoading: boolean,
  onContinueCourse: (courseId: string) => void
}) {
  const [activeSubject, setActiveSubject] = useState('all');
  
  // Refs for scrolling to sections
  const allRef = useRef<HTMLDivElement>(null);
  const enrolledRef = useRef<HTMLDivElement>(null);
  const englishRef = useRef<HTMLDivElement>(null);
  const psychologyRef = useRef<HTMLDivElement>(null);
  const mathRef = useRef<HTMLDivElement>(null);

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some(enrollment => enrollment.course_id === courseId);
  };

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrolledCourses.find(e => e.course_id === courseId);
    return enrollment?.progress || 0;
  };

  // Subject tabs with icons
  const subjects = [
    { id: 'all', label: 'All', icon: GraduationCap, ref: allRef },
    { id: 'enrolled', label: 'Enrolled', icon: CheckCircle, ref: enrolledRef },
    { id: 'English', label: 'English', icon: BookOpen, ref: englishRef },
    { id: 'Psychology', label: 'Psychology', icon: Brain, ref: psychologyRef },
    { id: 'Mathematics', label: 'Math', icon: Calculator, ref: mathRef },
  ];

  const scrollToSection = (subjectId: string) => {
    setActiveSubject(subjectId);
    const subject = subjects.find(s => s.id === subjectId);
    if (subject?.ref.current) {
      subject.ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const getSubjectIcon = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('english')) {
      return <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />;
    } else if (subjectLower.includes('psychology')) {
      return <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />;
    } else if (subjectLower.includes('math')) {
      return <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />;
    }
    return <GraduationCap className="h-8 w-8 text-gray-600 dark:text-gray-400" />;
  };

  const getSubjectColor = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('english')) {
      return 'bg-green-100 dark:bg-green-900/30';
    } else if (subjectLower.includes('psychology')) {
      return 'bg-purple-100 dark:bg-purple-900/30';
    } else if (subjectLower.includes('math')) {
      return 'bg-blue-100 dark:bg-blue-900/30';
    }
    return 'bg-gray-100 dark:bg-gray-900/30';
  };

  const renderCourseCard = (course: Course) => {
    const enrolled = isEnrolled(course.id);
    const progress = getEnrollmentProgress(course.id);
    
    return (
      <Card key={course.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${getSubjectColor(course.subject)} flex-shrink-0`}>
              {getSubjectIcon(course.subject)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">{course.title}</h3>
                {!course.is_free && !enrolled && (
                  <Badge variant="outline" className="text-xs">₹{course.price}</Badge>
                )}
                {course.is_free && (
                  <Badge variant="outline" className="text-green-600 border-green-600 text-xs">Free</Badge>
                )}
                {enrolled && (
                  <Badge className="bg-blue-600 text-xs">Enrolled</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{course.description}</p>
              {enrolled && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              {enrolled ? (
                <Button 
                  size="sm" 
                  className="text-sm"
                  onClick={() => onContinueCourse(course.id)}
                >
                  Continue
                </Button>
              ) : (
                <Button size="sm" onClick={() => onEnroll(course.id)} className="text-sm">
                  {course.is_free ? 'Enroll' : `₹${course.price}`}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Subject Tabs - Horizontal scrollable on mobile */}
      <div className="sticky top-16 z-30 bg-gray-50 dark:bg-gray-900 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => scrollToSection(subject.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeSubject === subject.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
              }`}
            >
              <subject.icon className="h-4 w-4" />
              {subject.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Sections */}
      <div className="space-y-8">
        {/* All Courses Section */}
        <section ref={allRef} className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Courses</h2>
              <p className="text-gray-600 dark:text-gray-400">Explore our complete course catalog</p>
            </div>
          </div>
          
          {coursesLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {courses.map(renderCourseCard)}
            </div>
          )}
        </section>

        {/* Enrolled Courses Section */}
        <section ref={enrolledRef} className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Enrolled Courses</h2>
              <p className="text-gray-600 dark:text-gray-400">Continue your learning journey</p>
            </div>
          </div>
          
          {coursesLoading ? (
            <div className="grid gap-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="grid gap-4">
              {enrolledCourses.map(enrollment => enrollment.course && renderCourseCard(enrollment.course))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No enrolled courses yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Start learning by enrolling in a course below</p>
                <Button onClick={() => scrollToSection('all')}>Browse All Courses</Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* English Courses Section */}
        <section ref={englishRef} className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">English Courses</h2>
              <p className="text-gray-600 dark:text-gray-400">Master English grammar and literature</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            {courses.filter(course => course.subject === 'English').map(renderCourseCard)}
          </div>
        </section>

        {/* Psychology Courses Section */}
        <section ref={psychologyRef} className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-3 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Psychology Courses</h2>
              <p className="text-gray-600 dark:text-gray-400">Understand human behavior and learning</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            {courses.filter(course => course.subject === 'Psychology').map(renderCourseCard)}
          </div>
        </section>

        {/* Mathematics Courses Section */}
        <section ref={mathRef} className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mathematics Courses</h2>
              <p className="text-gray-600 dark:text-gray-400">Build strong quantitative skills</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            {courses.filter(course => course.subject === 'Mathematics').map(renderCourseCard)}
          </div>
        </section>
      </div>
    </div>
  );
}

function TestsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Practice Tests</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Topic-wise</Button>
          <Button variant="outline" size="sm">Full Mock</Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">English Mock Test #{i}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">50 questions • 60 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {i <= 2 && <Badge variant="outline">Completed</Badge>}
                  <Button size="sm">{i <= 2 ? 'Review' : 'Start Test'}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DiscussContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discussions</h1>
        <Button>Ask Question</Button>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Question about verb tenses</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Can someone explain the difference between present perfect and past perfect?
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>2 hours ago</span>
                  <span>3 replies</span>
                  <span>English Grammar</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">R</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Psychology study tips</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  What are the best ways to memorize psychology theories?
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>5 hours ago</span>
                  <span>7 replies</span>
                  <span>Educational Psychology</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileContent({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <Button variant="outline" onClick={onSignOut}>Sign Out</Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-xl font-medium text-white">
                {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.user_metadata?.full_name || 'Student'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Courses Enrolled</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Day Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <p className="text-gray-900 dark:text-white">{user.user_metadata?.full_name || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p className="text-gray-900 dark:text-white">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Created</label>
            <p className="text-gray-900 dark:text-white">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar Skeleton */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4 shadow-xl">
          <div className="flex h-16 shrink-0 items-center">
            <Skeleton className="h-8 w-32" />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {[...Array(8)].map((_, i) => (
                    <li key={i}>
                      <Skeleton className="h-10 w-full rounded-md" />
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="lg:pl-72">
        {/* Top bar skeleton */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-6 lg:hidden" />
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Main content skeleton */}
        <main className="py-6 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-6">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            
            <div>
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="flex gap-4 overflow-x-auto pb-4">
                <Skeleton className="min-w-[280px] h-32 rounded-lg" />
                <Skeleton className="min-w-[280px] h-32 rounded-lg" />
              </div>
            </div>

            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom navigation skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:hidden">
        <div className="grid grid-cols-5 h-16">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center space-y-1">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}