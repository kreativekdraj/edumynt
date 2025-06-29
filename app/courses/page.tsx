'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, Brain, Target, Eye, Clock, Users } from 'lucide-react';
import { getPublishedCourses, type Course } from '@/lib/supabase-queries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const subjectConfig = {
  'English': {
    icon: BookOpen,
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  'Psychology': {
    icon: Brain,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  'Mathematics': {
    icon: Target,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800'
  }
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('');
  
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const tabsRef = useRef<HTMLDivElement>(null);

  // Group courses by subject
  const coursesBySubject = courses.reduce((acc, course) => {
    if (!acc[course.subject]) {
      acc[course.subject] = [];
    }
    acc[course.subject].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const availableSubjects = Object.keys(coursesBySubject);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const publishedCourses = await getPublishedCourses();
        setCourses(publishedCourses);
        
        // Set initial active tab to first subject with courses
        if (publishedCourses.length > 0) {
          const firstSubject = publishedCourses[0].subject;
          setActiveTab(firstSubject);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Intersection Observer for viewport detection
  useEffect(() => {
    if (availableSubjects.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const subject = entry.target.getAttribute('data-subject');
            if (subject) {
              setActiveTab(subject);
            }
          }
        });
      },
      {
        threshold: [0.3],
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    // Observe all subject sections
    availableSubjects.forEach(subject => {
      const element = sectionRefs.current[subject];
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [availableSubjects]);

  const scrollToSubject = (subject: string) => {
    const element = sectionRefs.current[subject];
    if (element) {
      const headerOffset = 120; // Account for sticky header and tabs
      const elementPosition = element.offsetTop - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const getSubjectIcon = (subject: string) => {
    const config = subjectConfig[subject as keyof typeof subjectConfig];
    if (!config) return BookOpen;
    return config.icon;
  };

  const getSubjectColor = (subject: string) => {
    const config = subjectConfig[subject as keyof typeof subjectConfig];
    return config?.color || 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center h-16 px-4 max-w-7xl mx-auto">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Courses
            </h1>
          </div>
          
          {/* Tabs Skeleton */}
          <div className="px-4 max-w-7xl mx-auto">
            <div className="flex gap-2 pb-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Courses Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            We're preparing amazing courses for you. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center h-16 px-4 max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Courses
          </h1>
        </div>
        
        {/* Subject Tabs */}
        {availableSubjects.length > 1 && (
          <div className="px-4 max-w-7xl mx-auto" ref={tabsRef}>
            <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide">
              {availableSubjects.map((subject) => {
                const Icon = getSubjectIcon(subject);
                const isActive = activeTab === subject;
                
                return (
                  <button
                    key={subject}
                    onClick={() => scrollToSubject(subject)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{subject}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto p-4 space-y-12">
        {availableSubjects.map((subject) => (
          <section
            key={subject}
            ref={(el) => { sectionRefs.current[subject] = el; }}
            data-subject={subject}
            className="scroll-mt-32"
          >
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const Icon = getSubjectIcon(subject);
                return (
                  <div className={`p-3 rounded-xl ${getSubjectColor(subject)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                );
              })()}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {subject}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {coursesBySubject[subject].length} course{coursesBySubject[subject].length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesBySubject[subject].map((course) => {
                const Icon = getSubjectIcon(course.subject);
                
                return (
                  <Card key={course.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${getSubjectColor(course.subject)} group-hover:scale-105 transition-transform`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {course.subject}
                            </Badge>
                            {course.is_free ? (
                              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                Free
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                ₹{course.price}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 hidden sm:block">
                            {course.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Self-paced</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Interactive</span>
                          </div>
                        </div>
                        <Link href={`/course/${course.id}`}>
                          <Button 
                            size="sm" 
                            className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}