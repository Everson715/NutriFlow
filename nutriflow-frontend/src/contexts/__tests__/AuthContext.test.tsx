/**
 * Unit tests for AuthContext
 * 
 * Tests cover:
 * - Session persistence and validation
 * - Authenticated vs unauthenticated flows
 * - Error handling (401, 403, network errors)
 * - Logout functionality
 * - Loading states
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock fetch globally
global.fetch = jest.fn();

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  describe('Session Validation', () => {
    it('should validate session on mount and set user when authenticated', async () => {
      const mockUser = { sub: '123', email: 'test@example.com' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockUser,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.user).toBe(null);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // User should be set after validation
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBe(null);

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/auth/validate',
        expect.objectContaining({
          credentials: 'include',
        }),
      );
    });

    it('should handle 401 (unauthorized) gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers(),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // User should be null, but error should also be null (401 is expected for unauthenticated)
      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle 403 (forbidden) and set error state', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: new Headers(),
        json: async () => ({ message: 'Access forbidden' }),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toEqual({
        message: 'Access forbidden. You don\'t have permission.',
        type: 'forbidden',
      });
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new TypeError('Failed to fetch'),
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toEqual({
        message: 'Network error. Please check your connection.',
        type: 'network',
      });
    });

    it('should handle missing API URL configuration', async () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      delete process.env.NEXT_PUBLIC_API_URL;

      // Re-render to trigger validation with missing env var
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should handle the error gracefully
      expect(result.current.user).toBe(null);

      // Restore env var
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });
  });

  describe('Manual Session Validation', () => {
    it('should allow manual session validation', async () => {
      const mockUser = { sub: '123', email: 'test@example.com' };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          headers: new Headers(),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockUser,
        });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initial validation to complete (will be 401)
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBe(null);

      // Manually validate session
      await act(async () => {
        await result.current.validateSession();
      });

      // User should now be set
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('should update error state when manual validation fails', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          headers: new Headers(),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          headers: new Headers(),
          json: async () => ({ message: 'Server error' }),
        });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Manually validate session
      await act(async () => {
        await result.current.validateSession();
      });

      expect(result.current.user).toBe(null);
      expect(result.current.error).toEqual({
        message: 'Server error',
        type: 'unknown',
      });
    });
  });

  describe('Logout', () => {
    it('should logout successfully and redirect to login', async () => {
      const mockUser = { sub: '123', email: 'test@example.com' };

      // Initial authenticated state
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockUser,
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers(),
        });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).not.toBe(null);
      });

      // Logout
      await act(async () => {
        await result.current.logout();
      });

      // User should be cleared
      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe(null);

      // Should redirect to login
      expect(mockReplace).toHaveBeenCalledWith('/login');

      // Verify logout API call
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/auth/logout',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        }),
      );
    });

    it('should logout even if API call fails (network error)', async () => {
      const mockUser = { sub: '123', email: 'test@example.com' };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockUser,
        })
        .mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).not.toBe(null);
      });

      // Logout with network error
      await act(async () => {
        await result.current.logout();
      });

      // User should still be cleared despite network error
      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);

      // Should still redirect
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });

    it('should logout even if API call fails with 500 error', async () => {
      const mockUser = { sub: '123', email: 'test@example.com' };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockUser,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          headers: new Headers(),
          json: async () => ({ message: 'Server error' }),
        });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).not.toBe(null);
      });

      // Logout with server error
      await act(async () => {
        await result.current.logout();
      });

      // User should still be cleared
      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);

      // Error should be set but shouldn't block logout
      expect(result.current.error).toEqual({
        message: 'Logout request failed, but you have been signed out locally.',
        type: 'unknown',
      });

      // Should still redirect
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });

  describe('Error Handling', () => {
    it('should clear error state on successful validation after error', async () => {
      // Initial network error
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ sub: '123', email: 'test@example.com' }),
        });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).not.toBe(null);

      // Validate again successfully
      await act(async () => {
        await result.current.validateSession();
      });

      // Error should be cleared
      expect(result.current.error).toBe(null);
      expect(result.current.user).not.toBe(null);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty JSON response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should handle empty response gracefully
      expect(result.current.user).toEqual({});
    });

    it('should handle non-JSON response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/plain' }),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should handle non-JSON response
      expect(result.current.user).toEqual({});
    });

    it('should handle response with error message in JSON', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Bad request error' }),
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual({
        message: 'Bad request error',
        type: 'unknown',
      });
    });
  });
});

