import { useState } from 'react'
import Image from 'next/image'
import styles from './card.module.css'
import { motion } from 'framer-motion'
import cls from 'classnames'

const Card = (props) => {
  const {
    imgUrl = 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1vdmllfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    size = 'medium',
    id,
    shouldScale = true
  } = props

  const [imgSrc, setImgSrc] = useState(imgUrl)

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem
  }

  const handleOnError = () => {
    setImgSrc(
      'https://images.unsplash.com/photo-1594908900066-3f47337549d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fG1vdmllfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
    )
  }

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 }
  const shouldHover = shouldScale && {
    whileHover: { ...scale }
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, classMap[size])}
        {...shouldHover}>
        <Image
          src={imgSrc}
          alt="image"
          layout="fill"
          onError={handleOnError}
          className={styles.cardImg}
        />
      </motion.div>
    </div>
  )
}

export default Card
