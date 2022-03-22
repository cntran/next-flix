import { findVideoIdByUser, insertStats, updateStats } from '../../lib/db/hasura'
import { verifyToken } from '../../lib/utils'

export default async function stats(req, res) {
  try {
    const token = req.cookies.token
    if (!token) {
      res.status(403).send({ msg: 'forbidden' })
    } else {
      const inputParams = req.method === 'POST' ? req.body : req.query
      const { videoId } = inputParams

      if (videoId) {
        const userId = verifyToken(token)

        const findVideo = await findVideoIdByUser(token, userId, videoId)
        const doesStatsExist = findVideo?.length > 0

        if (req.method === 'POST') {
          const { favorited, watched = true } = req.body
          if (doesStatsExist) {
            // update it
            const response = await updateStats(token, {
              favorited,
              watched,
              userId,
              videoId
            })
            res.send({ data: response })
          } else {
            // add it
            const response = await insertStats(token, {
              favorited,
              watched,
              userId,
              videoId
            })
            res.send({ data: response })
          }
        } else {
          if (doesStatsExist) {
            res.send(findVideo)
          } else {
            res.status(404)
            res.send({ user: null, msg: 'Video not found' })
          }
        }
      }
    }
  } catch (error) {
    console.error('Error occurred /stats', error)
    res.status(500).send({ done: false, error: error?.messge })
  }
}
