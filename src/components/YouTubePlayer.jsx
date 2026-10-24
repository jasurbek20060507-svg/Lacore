import React, { useEffect, useRef, useState } from 'react'
import { useMuseumStore } from '../store'
import { getYouTubeId } from '../utils/youtube'

export default function YouTubePlayer({
  museumMusicUrl = 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
  waltzMusicUrl = 'https://www.youtube.com/watch?v=LVkEu1J8boo',
  isDancing = false,
}) {
  const { musicEnabled, isVideoPlaying } = useMuseumStore()
  const playerRef = useRef(null)
  const [isReady, setIsReady] = useState(false)
  const containerId = 'youtube-music-player-container'

  // Pick active video based on waltz mode
  const currentUrl = isDancing ? (waltzMusicUrl || 'https://www.youtube.com/watch?v=LVkEu1J8boo') : (museumMusicUrl || 'https://www.youtube.com/watch?v=2Vv-BfVoq4g')
  const videoId = getYouTubeId(currentUrl)

  // Load YouTube IFrame API script
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        if (playerRef.current && playerRef.current.destroy) {
          try { playerRef.current.destroy() } catch (e) {}
        }

        playerRef.current = new window.YT.Player(containerId, {
          height: '1',
          width: '1',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: videoId,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              setIsReady(true)
              event.target.setVolume(isVideoPlaying ? 12 : 70)
              if (musicEnabled || isDancing) {
                event.target.playVideo()
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.playVideo()
              }
            },
          },
        })
      }
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try { playerRef.current.destroy() } catch (e) {}
      }
    }
  }, [videoId])

  // Play/pause control
  useEffect(() => {
    if (!playerRef.current || !isReady || !playerRef.current.playVideo) return

    try {
      if (musicEnabled || isDancing) {
        playerRef.current.playVideo()
      } else {
        playerRef.current.pauseVideo()
      }
    } catch (e) {
      console.warn('YouTube playback action:', e)
    }
  }, [musicEnabled, isDancing, isReady])

  // Audio Ducking: lower music volume when video is playing
  useEffect(() => {
    if (!playerRef.current || !isReady || !playerRef.current.setVolume) return

    try {
      if (isVideoPlaying) {
        // Lower volume so video audio is crystal clear
        playerRef.current.setVolume(12)
      } else {
        // Restore rich romantic volume
        playerRef.current.setVolume(70)
      }
    } catch (e) {}
  }, [isVideoPlaying, isReady])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '-100px',
        left: '-100px',
        width: '1px',
        height: '1px',
        opacity: 0.01,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <div id={containerId} />
    </div>
  )
}
