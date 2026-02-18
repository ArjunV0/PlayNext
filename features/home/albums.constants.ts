export interface Album {
  id: string
  title: string
  description: string
  coverUrl: string
}

export const MADE_FOR_YOU: Album[] = [
  {
    id: "mfy-1",
    title: "Daily Mix 1",
    description: "Neon Waves, Lunar Drift and more",
    coverUrl: "/covers/daily-mix-1.jpg",
  },
  {
    id: "mfy-2",
    title: "Discover Weekly",
    description: "Your weekly mixtape of fresh music",
    coverUrl: "/covers/discover-weekly.jpg",
  },
  {
    id: "mfy-3",
    title: "Release Radar",
    description: "Catch all the latest from artists you follow",
    coverUrl: "/covers/release-radar.jpg",
  },
  {
    id: "mfy-4",
    title: "Chill Mix",
    description: "Ambient, downtempo and lo-fi beats",
    coverUrl: "/covers/chill-mix.jpg",
  },
  {
    id: "mfy-5",
    title: "Focus Flow",
    description: "Instrumental music to help you concentrate",
    coverUrl: "/covers/focus-flow.jpg",
  },
  {
    id: "mfy-6",
    title: "Energy Boost",
    description: "High energy tracks to power your day",
    coverUrl: "/covers/energy-boost.jpg",
  },
]

export const TOP_HITS_GLOBAL: Album[] = [
  {
    id: "thg-1",
    title: "Today's Top Hits",
    description: "The biggest songs right now",
    coverUrl: "/covers/todays-top-hits.jpg",
  },
  {
    id: "thg-2",
    title: "Global Top 50",
    description: "The most played tracks worldwide",
    coverUrl: "/covers/global-top-50.jpg",
  },
  {
    id: "thg-3",
    title: "Viral Hits",
    description: "Trending tracks across the globe",
    coverUrl: "/covers/viral-hits.jpg",
  },
  { id: "thg-4", title: "Pop Rising", description: "The future of pop music", coverUrl: "/covers/pop-rising.jpg" },
  { id: "thg-5", title: "Hot Hits", description: "The hottest tracks of the week", coverUrl: "/covers/hot-hits.jpg" },
  {
    id: "thg-6",
    title: "All Out 2020s",
    description: "The biggest songs of the decade so far",
    coverUrl: "/covers/all-out-2020s.jpg",
  },
]

export const TOP_HITS_INDIA: Album[] = [
  {
    id: "thi-1",
    title: "Bollywood Butter",
    description: "Smooth Bollywood hits for every mood",
    coverUrl: "/covers/bollywood-butter.jpg",
  },
  {
    id: "thi-2",
    title: "Punjabi 101",
    description: "The best Punjabi tracks right now",
    coverUrl: "/covers/punjabi-101.jpg",
  },
  {
    id: "thi-3",
    title: "Indie India",
    description: "Fresh independent music from India",
    coverUrl: "/covers/indie-india.jpg",
  },
  {
    id: "thi-4",
    title: "Desi Hip Hop",
    description: "Top Indian hip hop and rap",
    coverUrl: "/covers/desi-hiphop.jpg",
  },
  { id: "thi-5", title: "Tamil Hits", description: "Chart-topping Tamil tracks", coverUrl: "/covers/tamil-hits.jpg" },
  {
    id: "thi-6",
    title: "Tollywood Rising",
    description: "Trending Telugu music",
    coverUrl: "/covers/tollywood-rising.jpg",
  },
]
