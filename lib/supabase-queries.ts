import { supabase } from './supabase';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  thumbnail_url: string | null;
  is_published: boolean;
  is_free: boolean;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
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

export interface UserCourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  course?: Course;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string | null;
  progress: number;
  lesson?: Lesson;
}

// Fetch all published courses
export async function getPublishedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }

  return data || [];
}

// Fetch user's enrolled courses
export async function getUserEnrolledCourses(userId: string): Promise<UserCourseEnrollment[]> {
  const { data, error } = await supabase
    .from('user_course_enrollments')
    .select(`
      *,
      course:courses(*)
    `)
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false });

  if (error) {
    console.error('Error fetching user enrollments:', error);
    return [];
  }

  return data || [];
}

// Fetch course with lessons
export async function getCourseWithLessons(courseId: string): Promise<Course & { lessons: Lesson[] } | null> {
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (courseError) {
    console.error('Error fetching course:', courseError);
    return null;
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError);
    return null;
  }

  return {
    ...course,
    lessons: lessons || []
  };
}

// Fetch preview lessons (accessible without enrollment)
export async function getPreviewLessons(courseId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_preview', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching preview lessons:', error);
    return [];
  }

  return data || [];
}

// Check if user is enrolled in a course
export async function isUserEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_course_enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking enrollment:', error);
    return false;
  }

  return !!data;
}

// Enroll user in a course
export async function enrollUserInCourse(userId: string, courseId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_course_enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      progress: 0
    });

  if (error) {
    console.error('Error enrolling user:', error);
    return false;
  }

  return true;
}

// Get user's lesson progress for a course
export async function getUserLessonProgress(userId: string, courseId: string): Promise<UserLessonProgress[]> {
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .select(`
      *,
      lesson:lessons!inner(*)
    `)
    .eq('user_id', userId)
    .eq('lesson.course_id', courseId);

  if (error) {
    console.error('Error fetching lesson progress:', error);
    return [];
  }

  return data || [];
}

// Mark lesson as completed
export async function markLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      progress: 100,
      completed_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error marking lesson completed:', error);
    return false;
  }

  return true;
}

// Update lesson progress
export async function updateLessonProgress(userId: string, lessonId: string, progress: number): Promise<boolean> {
  const { error } = await supabase
    .from('user_lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      progress: Math.min(100, Math.max(0, progress))
    });

  if (error) {
    console.error('Error updating lesson progress:', error);
    return false;
  }

  return true;
}