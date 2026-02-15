import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('logs in with correct credentials', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      const loginResult = result.current.login('intern@demo.com', 'intern123', false)
      expect(loginResult.success).toBe(true)
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user.email).toBe('intern@demo.com')
  })

  it('fails login with incorrect credentials', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      const loginResult = result.current.login('wrong@email.com', 'wrongpass', false)
      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Invalid email or password')
    })

    expect(result.current.user).toBeNull()
  })

  it('logs out successfully', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.login('intern@demo.com', 'intern123', false)
    })

    expect(result.current.user).not.toBeNull()

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
  })

  it('saves remember me preference to localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.login('intern@demo.com', 'intern123', true)
    })

    const savedAuth = localStorage.getItem('auth')
    expect(savedAuth).not.toBeNull()
    const authData = JSON.parse(savedAuth)
    expect(authData.rememberMe).toBe(true)
  })
})
