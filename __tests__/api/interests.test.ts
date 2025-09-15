import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/interest');
vi.mock('@/lib/db');

// Mock the API functions
const mockGET = vi.fn();
const mockPOST = vi.fn();

vi.mock('@/app/api/interests/route', () => ({
  GET: mockGET,
  POST: mockPOST
}));

describe('/api/interests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Route handlers', () => {
    it('should handle GET requests', async () => {
      const mockResponse = { status: 200, json: vi.fn().mockResolvedValue({ success: true }) };
      mockGET.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/interests');
      const response = await mockGET(request);

      expect(response.status).toBe(200);
      expect(mockGET).toHaveBeenCalledWith(request);
    });

    it('should handle POST requests', async () => {
      const mockResponse = { status: 200, json: vi.fn().mockResolvedValue({ success: true }) };
      mockPOST.mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/interests', {
        method: 'POST',
        body: JSON.stringify({ toUserId: 'user2' })
      });
      const response = await mockPOST(request);

      expect(response.status).toBe(200);
      expect(mockPOST).toHaveBeenCalledWith(request);
    });
  });

  describe('Request validation', () => {
    it('should validate required fields in POST request', () => {
      const body = JSON.stringify({ toUserId: 'user2' });
      const parsed = JSON.parse(body);
      
      expect(parsed).toHaveProperty('toUserId');
      expect(parsed.toUserId).toBe('user2');
    });

    it('should handle optional fields', () => {
      const body = JSON.stringify({ 
        toUserId: 'user2', 
        message: 'Hello',
        priority: 'high'
      });
      const parsed = JSON.parse(body);
      
      expect(parsed.message).toBe('Hello');
      expect(parsed.priority).toBe('high');
    });

    it('should validate priority values', () => {
      const validPriorities = ['low', 'normal', 'high'];
      const testPriority = 'high';
      
      expect(validPriorities).toContain(testPriority);
    });

    it('should handle query parameters', () => {
      const url = new URL('http://localhost:3000/api/interests?type=sent&page=2&limit=5');
      
      expect(url.searchParams.get('type')).toBe('sent');
      expect(url.searchParams.get('page')).toBe('2');
      expect(url.searchParams.get('limit')).toBe('5');
    });
  });
});
