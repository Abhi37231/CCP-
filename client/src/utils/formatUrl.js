export const getMediaUrl = (url) => {
  if (!url) return '';
  // If it's already an absolute URL (like Cloudinary), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // For legacy local uploads, prepend the backend URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Ensure we don't have double slashes
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  // Remove trailing slash from base url if it has one
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBase}${cleanUrl}`;
};
