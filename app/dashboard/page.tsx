'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, Zap, Smartphone, Play, Clock, Users, Star } from 'lucide-react';
import { getPublishedCourses, getUserEnrolledCourses, type Course } from '@/lib/supabase-queries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user) {
      const fetchData = async () => {
        try {
          const [publishedCourses, userEnrollments] = await Promise.all([
            getPublishedCourses(),
            getUserEnrolledCourses(user.id)
          ]);
          
          setCourses(publishedCourses.slice(0, 3));
          setEnrolledCourses(userEnrollments);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full space-y-12">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-48 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.full_name || 'Student'}!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Continue your learning journey with our comprehensive courses
          </p>
        </div>

        {/* Enrolled Courses */}
        {enrolledCourses.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrollment) => (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{enrollment.course?.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {enrollment.course?.subject}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${enrollment.progress || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {enrollment.progress || 0}% complete
                      </p>
                      <Link href={`/course/${enrollment.course?.id}`}>
                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
            <Link href="/courses">
              <Button variant="outline">View All Courses</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
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
                    <Link href={`/course/${course.id}`}>
                      <Button size="sm">
                        Explore →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}