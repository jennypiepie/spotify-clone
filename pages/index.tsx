import type { NextPage } from 'next'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'
import PlaylistContextProvider from '../contexts/PlaylistContext'

const Home: NextPage = () => {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <PlaylistContextProvider>
        <Head>
          <title>Spotify 2.0</title>
          <meta name="description" content="Spotify 2.0" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='flex'>
          <Sidebar />
          <Center />
        </main>
      </PlaylistContextProvider>
    </div>
  )
}

export default Home
