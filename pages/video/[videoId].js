import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import NavBar from '../../components/nav/navbar'
import Modal from 'react-modal'
import styles from '../../styles/Video.module.css'
import cls from 'classnames'
import { getYoutubeVideoById } from '../../lib/videos'
import DisLike from '../../components/icons/dislike-icon'
import Like from '../../components/icons/like-icon'

Modal.setAppElement('#__next')

export async function getStaticProps(context) {
  const videoId = context.params.videoId
  const videoArray = await getYoutubeVideoById(videoId)

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {}
    },
    revalidate: 10
  }
}

export async function getStaticPaths() {
  const listOfVideos = ['mYfJxlgR2jw', '4zH5iYM4wJo', 'KCPEHsAViiQ']
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId }
  }))

  return { paths, fallback: 'blocking' }
}

const Video = ({ video }) => {
  const router = useRouter()

  const videoId = router.query.videoId
  const [toggleLike, setToggleLike] = useState(false)
  const [toggleDisLike, setToggleDisLike] = useState(false)

  const { title, publishTime, description, channelTitle, viewCount } = video

  useEffect(() => {
    async function fetchStats() {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.length > 0) {
        const favorited = data[0].favorited
        if (favorited === 1) {
          setToggleLike(true)
        } else if (favorited === 0) {
          setToggleDisLike(true)
        }
      }
    }
    fetchStats()
  }, [videoId])

  const runRatingService = async (favorited) => {
    const response = await fetch('/api/stats', {
      method: 'POST',
      body: JSON.stringify({
        videoId,
        favorited
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }

  const handleToggleDisLike = async () => {
    const val = !toggleDisLike
    setToggleDisLike(!toggleDisLike)
    setToggleLike(toggleDisLike)

    const favorited = val ? 0 : 1
    await runRatingService(favorited)
  }

  const handleToggleLike = async () => {
    const val = !toggleLike
    setToggleLike(val)
    setToggleDisLike(toggleLike)

    const favorited = val ? 1 : 0
    await runRatingService(favorited)
  }

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        overlayClassName={styles.overlay}
        className={styles.modal}>
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
          frameBorder="0"
        />

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>

          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleDisLike}>
              <div className={styles.btnWrapper}>
                <DisLike selected={toggleDisLike} />
              </div>
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Video
