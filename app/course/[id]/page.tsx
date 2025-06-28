'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  Lock, 
  Eye,
  ArrowLeft,
  Download,
  Share2,
  Heart,
  PlayCircle,
  FileText,
  Award,
  Target,
  TrendingUp,
  Brain,
  MessageCircle
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { 
  getCourseWithLessons, 
  isUserEnrolledInCourse, 
  enrollUserInCourse,
  getPublishedCourses,
  type Course,
  type Lesson 
} from '@/lib/supabase-queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

// Required for static export builds
export async function generateStaticParams() {
  try {
    const courses = await getPublishedCourses();
    return courses.map((course) => ({
      id: course.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array as fallback
    return [];
  }
}

export default function CourseDetailsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<CourseWithLessons | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !courseId) return;
    
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const courseData = await getCourseWithLessons(courseId);
        if (!courseData) {
          router.push('/404');
          return;
        }
        
        setCourse(courseData);
        
        if (user) {
          const enrolled = await isUserEnrolledInCourse(user.id, courseId);
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user, mounted, router]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setEnrolling(true);
    try {
      const success = await enrollUserInCourse(user.id, courseId);
      if (success) {
        setIsEnrolled(true);
        // Redirect to course dashboard
        router.push(`/dashboard?tab=courses&course=${courseId}`);
      }
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    if (isEnrolled) {
      router.push(`/dashboard?tab=courses&course=${courseId}`);
    } else {
      handleEnroll();
    }
  };

  const getSubjectIcon = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('english')) {
      return <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />;
    } else if (subjectLower.includes('psychology')) {
      return <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
    } else if (subjectLower.includes('math')) {
      return <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
    return <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
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

  if (!mounted || loading) {
    return <CourseDetailsSkeleton />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Course Not Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/dashboard?tab=courses')}>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const previewLessons = course.lessons.filter(lesson => lesson.is_preview);
  const totalLessons = course.lessons.length;
  const estimatedDuration = course.lessons.reduce((total, lesson) => total + lesson.estimated_duration, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center h-16 px-4 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {course.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 pb-20">
        {/* Course Hero Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Course Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${getSubjectColor(course.subject)}`}>
                    {getSubjectIcon(course.subject)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{course.subject}</Badge>
                      {course.is_free ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Free
                        </Badge>
                      ) : (
                        <Badge variant="outline">₹{course.price}</Badge>
                      )}
                      {isEnrolled && (
                        <Badge className="bg-blue-600">Enrolled</Badge>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <FileText className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {totalLessons}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lessons</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {Math.round(estimatedDuration / 60)}h
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {previewLessons.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Preview</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        4.8
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Master fundamental concepts with clear explanations",
                    "Practice with interactive quizzes and assessments",
                    "Get personalized AI assistance for doubts",
                    "Access downloadable notes and study materials",
                    "Track your progress with detailed analytics",
                    "Join community discussions with fellow learners"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {course.is_free ? (
                    <div>
                      <p className="text-3xl font-bold text-green-600 mb-1">Free</p>
                      <p className="text-sm text-gray-500">Full access included</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        ₹{course.price}
                      </p>
                      <p className="text-sm text-gray-500">One-time payment</p>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full mb-4" 
                  size="lg"
                  onClick={handleStartLearning}
                  disabled={enrolling}
                >
                  {enrolling ? (
                    "Enrolling..."
                  ) : isEnrolled ? (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continue Learning
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {course.is_free ? 'Enroll Free' : 'Enroll Now'}
                    </>
                  )}
                </Button>

                {!isEnrolled && (
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Mobile & desktop friendly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>AI-powered assistance</span>
                    </div>
                  </div>
                )}

                {previewLessons.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Try it free
                    </h4>
                    <div className="space-y-2">
                      {previewLessons.slice(0, 2).map((lesson) => (
                        <button
                          key={lesson.id}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => router.push(`/lesson/${lesson.id}`)}
                        >
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {lesson.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 ml-6">
                            {lesson.estimated_duration} min • Preview
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Course Content
            </CardTitle>
            <CardDescription>
              {totalLessons} lessons • {Math.round(estimatedDuration / 60)} hours total length
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    lesson.is_preview || isEnrolled
                      ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-gray-200 dark:border-gray-700'
                      : 'border-gray-200 dark:border-gray-700 opacity-75'
                  }`}
                  onClick={() => {
                    if (lesson.is_preview || isEnrolled) {
                      router.push(`/lesson/${lesson.id}`);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.estimated_duration} min
                        </span>
                        {lesson.content && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Text
                          </span>
                        )}
                        {lesson.video_url && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <PlayCircle className="h-3 w-3" />
                            Video
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lesson.is_preview ? (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Badge>
                    ) : !isEnrolled ? (
                      <Lock className="h-4 w-4 text-gray-400" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!isEnrolled && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Unlock Full Course
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      Enroll to access all {totalLessons} lessons, quizzes, and downloadable resources.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI-Powered Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Smart Doubt Solving</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get instant answers to your questions with context-aware AI assistance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Personalized Practice</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI generates custom questions based on your weak areas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Progress Insights</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track your learning with detailed analytics and recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Community & Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Discussion Forums</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Connect with fellow learners and share knowledge.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Expert Guidance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get help from experienced instructors and mentors.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Study Groups</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Join study groups and learn together with peers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CourseDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center h-16 px-4 max-w-7xl mx-auto">
          <Skeleton className="h-8 w-16 mr-4" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-6 w-8 mx-auto mb-1" />
                      <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Skeleton className="h-8 w-20 mx-auto mb-1" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
                <Skeleton className="h-12 w-full mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <div className="flex gap-4">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}