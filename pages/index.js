import Head from 'next/head'
import Banner from '../components/banner/banner'
import NavBar from '../components/nav/navbar'
import styles from '../styles/Home.module.css'
import SectionCards from '../components/card/section-cards'
import { getPopularVideos, getVideos, getWatchItAgainVideos } from '../lib/videos'
import utilRedirectUser from '../utils/redirectUser'

export async function getServerSideProps(context) {
  const { userId, token } = await utilRedirectUser(context)
  const disneyVideos = (await getVideos('disney trailer')) || []
  const productivityVideos = (await getVideos('Productivity')) || []
  const travelVideos = (await getVideos('travel')) || []
  const popularVideos = (await getPopularVideos()) || []
  const watchItAgainVideos = (await getWatchItAgainVideos(userId, token)) || []

  return {
    props: {
      disneyVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
      watchItAgainVideos
    }
  }
}

export default function Home({
  disneyVideos,
  productivityVideos,
  travelVideos,
  popularVideos,
  watchItAgainVideos
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflix</title>
        <meta name="description" content="Nextflix" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <NavBar />
        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />

        <div className={styles.sectionWrapper}>
          {watchItAgainVideos && watchItAgainVideos.length > 0 && (
            <SectionCards
              title="Watch it again"
              videos={watchItAgainVideos}
              size="small"
            />
          )}
          {disneyVideos && (
            <SectionCards title="Disney" videos={disneyVideos} size="large" />
          )}
          {travelVideos && (
            <SectionCards title="Travel" videos={travelVideos} size="small" />
          )}
          {productivityVideos && (
            <SectionCards
              title="Productivity"
              videos={productivityVideos}
              size="medium"
            />
          )}
          {popularVideos && (
            <SectionCards title="Popular" videos={popularVideos} size="small" />
          )}
        </div>
      </div>
    </div>
  )
}
