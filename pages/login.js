import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Login.module.css'
import { magic } from '../lib/magic-client'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [userMsg, setUserMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false)
    }

    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  const handleOnChangeEmail = (e) => {
    setUserMsg('')
    setEmail(e.target.value)
  }

  const handleLoginWithEmail = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (email) {
      try {
        const didToken = await magic.auth.loginWithMagicLink({ email })
        if (didToken) {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${didToken}`,
              'Content-Type': 'application/json'
            }
          })

          const loggedInResponse = await response.json()
          if (loggedInResponse.done) {
            console.log({ loggedInResponse })
            router.push('/')
          } else {
            setIsLoading(false)
            setUserMsg('Something went wrong logging in')
          }
        }
      } catch (err) {
        setIsLoading(false)
        console.log('Something went wrong logging in', err)
      }
    } else {
      setIsLoading(false)
      setUserMsg('Enter a valid email address')
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image src="/static/netflix.svg" alt="NextFlix" width="128" height="34" />
            </div>
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Login
