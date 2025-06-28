'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { 
  BookOpen, 
  ArrowLeft, 
  Settings, 
  Eye, 
  Lock,
  CheckCircle,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  order_index: number;
  is_preview: boolean;
  estimated_duration: number;
  created_at: string;
  updated_at: string;
}

export default function LessonPage() {
  const [user, setUser] = useState<User | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

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
    if (!mounted || !lessonId) return;
    
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const { data: lessonData, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single();

        if (error || !lessonData) {
          router.push('/404');
          return;
        }

        setLesson(lessonData);

        // Check access - preview lessons are always accessible
        if (lessonData.is_preview) {
          setHasAccess(true);
        } else if (user) {
          // Check if user is enrolled in the course
          const { data: enrollment } = await supabase
            .from('user_course_enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', lessonData.course_id)
            .single();
          
          setHasAccess(!!enrollment);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, user, mounted, router]);

  if (!mounted || loading) {
    return <LessonSkeleton />;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lesson Not Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              The lesson you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/dashboard?tab=courses')}>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lesson Locked</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You need to enroll in this course to access this lesson.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => router.push(`/course/${lesson.course_id}`)}
                className="w-full"
              >
                View Course Details
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard?tab=courses')}
                className="w-full"
              >
                Browse All Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center h-16 px-4 max-w-4xl mx-auto">
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
              {lesson.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {lesson.is_preview && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Badge>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Lesson Content */}
        <Card>
          <CardContent className="p-6">
            {/* Video Section */}
            {lesson.video_url && (
              <div className="mb-6">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-full"
                    poster="/api/placeholder/800/450"
                  >
                    <source src={lesson.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}

            {/* Text Content */}
            {lesson.content && (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                  className="leading-relaxed"
                />
              </div>
            )}

            {/* Lesson Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Estimated duration: {lesson.estimated_duration} minutes</span>
                <span>Lesson {lesson.order_index + 1}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Notice */}
        {lesson.is_preview && !user && (
          <Alert className="mt-6">
            <Eye className="h-4 w-4" />
            <AlertDescription>
              This is a preview lesson. <strong>Sign up</strong> to access the full course with all lessons, quizzes, and features.
              <div className="mt-2">
                <Button 
                  size="sm" 
                  onClick={() => router.push('/auth/signup')}
                  className="mr-2"
                >
                  Sign Up Free
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/course/${lesson.course_id}`)}
                >
                  View Course
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Button>
          <Button>
            Next Lesson
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center h-16 px-4 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-16 mr-4" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            {/* Video Skeleton */}
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Info Skeleton */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Skeleton */}
        <div className="flex justify-between items-center mt-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}