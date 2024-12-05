
import { useState } from 'react'
import LoginForm from '@/components/LoginForm'
import SignupForm from '@/components/SignupForm'
import { Button } from '@/components/ui/button'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        {isLogin ? <LoginForm /> : <SignupForm />}
        <Button
          variant="link"
          className="mt-4 w-full"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </Button>
      </div>
    </div>
  )
}

