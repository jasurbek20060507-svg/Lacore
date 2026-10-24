// Extract YouTube Video ID from any YouTube URL format
export function getYouTubeId(url) {
  if (!url) return 'LVkEu1J8boo' // Default: Izzat Shukurov - Devonangman

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim()
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  if (match && match[2].length === 11) {
    return match[2]
  }

  return 'LVkEu1J8boo'
}
