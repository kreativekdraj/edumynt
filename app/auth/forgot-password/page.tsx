'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';

import { resetPassword } from '@/lib/auth';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await resetPassword(data.email);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'An unexpected error occurred');
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <Card className="border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-green-600 p-3 rounded-full">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
                  <p className="text-gray-600">
                    We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-600">Enter your email to receive a reset link</p>
          </div>
        </div>

        {/* Reset Password Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              We'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <LoadingButton
                type="submit"
                className="w-full"
                loading={isLoading}
                loadingText="Sending reset link..."
              >
                Send Reset Link
              </LoadingButton>
            </form>

            {/* Back to Sign In */}
            <div className="text-center pt-4 border-t">
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Edumynt. Student-first learning platform.</p>
        </div>
      </div>
    </div>
  );
}