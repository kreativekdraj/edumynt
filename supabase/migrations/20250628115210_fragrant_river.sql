/*
  # Create courses and lessons schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `subject` (text)
      - `thumbnail_url` (text, optional)
      - `is_published` (boolean)
      - `is_free` (boolean)
      - `price` (decimal, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text)
      - `video_url` (text, optional)
      - `order_index` (integer)
      - `is_preview` (boolean)
      - `estimated_duration` (integer, minutes)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_course_enrollments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `course_id` (uuid, foreign key)
      - `enrolled_at` (timestamp)
      - `progress` (decimal, 0-100)
    
    - `user_lesson_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `lesson_id` (uuid, foreign key)
      - `completed_at` (timestamp, optional)
      - `progress` (decimal, 0-100)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own data
    - Add policies for course access based on enrollment
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  thumbnail_url text,
  is_published boolean DEFAULT false,
  is_free boolean DEFAULT true,
  price decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  video_url text,
  order_index integer NOT NULL DEFAULT 0,
  is_preview boolean DEFAULT false,
  estimated_duration integer DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user course enrollments table
CREATE TABLE IF NOT EXISTS user_course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  progress decimal(5,2) DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Create user lesson progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at timestamptz,
  progress decimal(5,2) DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policies for courses
CREATE POLICY "Anyone can view published courses"
  ON courses
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for lessons
CREATE POLICY "Anyone can view preview lessons of published courses"
  ON lessons
  FOR SELECT
  USING (
    is_preview = true 
    AND EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.is_published = true
    )
  );

CREATE POLICY "Enrolled users can view all lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_course_enrollments 
      WHERE user_course_enrollments.course_id = lessons.course_id 
      AND user_course_enrollments.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.is_free = true 
      AND courses.is_published = true
    )
  );

-- Policies for enrollments
CREATE POLICY "Users can view their own enrollments"
  ON user_course_enrollments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own enrollments"
  ON user_course_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own enrollments"
  ON user_course_enrollments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for lesson progress
CREATE POLICY "Users can view their own lesson progress"
  ON user_lesson_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own lesson progress"
  ON user_lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own lesson progress"
  ON user_lesson_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON user_course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON user_course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);