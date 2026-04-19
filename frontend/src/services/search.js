/**
 * Search Service - Frontend API calls for news search
 */
import axios from 'axios';

export async function searchNews(query) {
  try {
    console.log('[Search Service] Searching for:', query);
    
    const response = await axios.post('http://localhost:5000/api/search', 
      { query },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('[Search Service] Response status:', response.status);
    console.log('[Search Service] Response data:', response.data);
    
    // Return the response data directly
    return response.data;
    
  } catch (error) {
    console.error('[Search Service] Error:', error);
    
    // If we have response data even in error, return it
    if (error.response && error.response.data) {
      console.log('[Search Service] Returning error response data:', error.response.data);
      return error.response.data;
    }
    
    // Otherwise return generic error
    return {
      success: false,
      message: 'Search failed',
      reason: error.message || 'Network error occurred',
      query,
      results: [],
    };
  }
}

export function getAuthenticityBadgeColor(score) {
  if (score >= 0.85) return 'green'; // High credibility
  if (score >= 0.65) return 'yellow'; // Medium credibility
  return 'red'; // Low credibility
}

export function getAuthenticityLabel(score) {
  if (score >= 0.85) return 'Highly Authentic ✓';
  if (score >= 0.65) return 'Moderately Authentic';
  if (score >= 0.5) return 'Unverified';
  return 'Low Credibility';
}
