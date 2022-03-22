import videoData from '../data/videos.json'
import { getMyListVideos, getWatchedVideos } from './db/hasura'

const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
  const BASE_URL = 'youtube.googleapis.com/youtube/v3'
  const response = await fetch(
    `https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
  )
  return response.json()
}

export const getCommonVideos = async (url) => {
  try {
    const isDev = process.env.DEVELOPMENT

    const data = isDev === 'true' ? videoData : await fetchVideos(url)

    if (data?.error) {
      console.log('Youtube API error', data.error)
      return []
    }

    return data?.items.map((item) => {
      const id = item.id?.videoId || item.id
      return {
        id,
        title: item?.snippet?.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        description: item?.snippet?.description,
        publishTime: item?.snippet?.publishedAt,
        channelTitle: item?.snippet?.channelTitle,
        viewCount: item?.statistics?.viewCount || 0
      }
    })
  } catch (error) {
    console.log('Something went wrong with video library', error)
    return []
  }
}

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&q=${searchQuery}&type=video`
  return getCommonVideos(URL)
}

export const getPopularVideos = (searchQuery) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US`
  return getCommonVideos(URL)
}

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`
  return getCommonVideos(URL)
}

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token)
  return mapVideos(videos)
}

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token)
  return mapVideos(videos)
}

const mapVideos = async (videos) => {
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
    }
  })
}
