'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, Zap, Smartphone } from 'lucide-react';
import { getPublishedCourses, type Course } from '@/lib/supabase-queries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const publishedCourses = await getPublishedCourses();
        setCourses(publishedCourses.slice(0, 3)); // Show only first 3 courses on homepage
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-12 text-center">
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
              Welcome to Edumynt
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Student-First Learning Platform for Government Exam Aspirants
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-xl max-w-2xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Get Started</h2>
            <p className="text-gray-600">
              Join thousands of students preparing for government exams with our comprehensive, interactive learning platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Courses Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive courses designed specifically for government exam preparation
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="text-left">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-8 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="text-left hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 rounded-lg ${
                        course.subject === 'English' ? 'bg-green-100' :
                        course.subject === 'Psychology' ? 'bg-purple-100' :
                        course.subject === 'Mathematics' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        {course.subject === 'English' ? (
                          <BookOpen className="h-6 w-6 text-green-600" />
                        ) : course.subject === 'Psychology' ? (
                          <CheckCircle className="h-6 w-6 text-purple-600" />
                        ) : (
                          <Zap className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {course.subject}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {course.is_free ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Free
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          ₹{course.price}
                        </Badge>
                      )}
                      <Link href="/auth/signup">
                        <Button size="sm" variant="ghost">
                          Explore →
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Courses Coming Soon</h3>
              <p className="text-gray-600">We're preparing amazing courses for you. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Interactive Learning</h3>
            </div>
            <p className="text-sm text-gray-600">
              Engage with content through embedded quizzes, AI assistance, and multimedia lessons.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI-Powered Tests</h3>
            </div>
            <p className="text-sm text-gray-600">
              Adaptive testing that targets your weak areas with detailed explanations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Mobile First</h3>
            </div>
            <p className="text-sm text-gray-600">
              Study anywhere with our responsive design and offline-capable platform.
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Edumynt. Student-first learning platform.</p>
        </div>
      </div>
    </div>
  );
}