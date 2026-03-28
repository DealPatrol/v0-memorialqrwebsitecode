'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, CheckCircle } from 'lucide-react'

export default function CreateAccountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    // Retrieve payment data from session storage
    const postPaymentData = sessionStorage.getItem('postPaymentData')
    if (postPaymentData) {
      setOrderData(JSON.parse(postPaymentData))
      setFormData(prev => ({
        ...prev,
        email: JSON.parse(postPaymentData).email || '',
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      })
      return false
    }

    if (!formData.firstName || !formData.lastName) {
      toast({
        title: 'Name Required',
        description: 'Please enter your first and last name.',
        variant: 'destructive',
      })
      return false
    }

    if (!formData.password) {
      toast({
        title: 'Password Required',
        description: 'Please enter a password.',
        variant: 'destructive',
      })
      return false
    }

    if (formData.password.length < 8) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      })
      return false
    }

    return true
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    setIsLoading(true)

    try {
      // Create Supabase account
      const response = await fetch('/api/auth/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          orderId: orderData?.orderId,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create account')
      }

      // Clear session data
      sessionStorage.removeItem('postPaymentData')
      localStorage.removeItem('checkoutItems')

      toast({
        title: 'Account Created!',
        description: 'Welcome to Memorial QR! Redirecting to your dashboard...',
      })

      // Redirect to dashboard or create memorial page
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error: any) {
      console.error('[v0] Account creation error:', error)
      toast({
        title: 'Account Creation Failed',
        description: error.message || 'There was an error creating your account. Please try again.',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-accent/10">
      <Header />
      
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Success Message */}
          <Card className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-green-900 dark:text-green-100">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">Payment Successful!</p>
              </div>
            </CardContent>
          </Card>

          {/* Account Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>
                Set up your account to access your memorial and manage your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      autoComplete="given-name"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      autoComplete="family-name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">At least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account & Continue'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
