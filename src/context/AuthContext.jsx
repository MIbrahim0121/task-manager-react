import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const DEMO_EMAIL = 'intern@demo.com'
const DEMO_PASSWORD = 'intern123'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved authentication
    const savedAuth = localStorage.getItem('auth')
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        if (authData.email === DEMO_EMAIL && authData.rememberMe) {
          setUser({ email: authData.email })
        }
      } catch (error) {
        console.error('Error parsing saved auth:', error)
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password, rememberMe) => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const userData = { email }
      setUser(userData)
      
      if (rememberMe) {
        localStorage.setItem('auth', JSON.stringify({ email, rememberMe: true }))
      } else {
        sessionStorage.setItem('auth', JSON.stringify({ email }))
      }
      
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth')
    sessionStorage.removeItem('auth')
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
