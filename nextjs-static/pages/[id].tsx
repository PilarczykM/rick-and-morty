import Head from 'next/head'
import styles from "../styles/Home.module.css"
import { CharacterResponse } from "../shared/types"
import { Character } from '../components/Character'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next/types'


export const getStaticPaths: GetStaticPaths = async () => {
  const characterResponse = await fetch("https://rickandmortyapi.com/api/character")
  const data: CharacterResponse = await characterResponse.json()

  const newPatch = [...Array(data.info.pages)].map((_, index) => ({ params: { id: String(index + 1)  } }))
  
  return {
    paths: newPatch,
    fallback: false, // can also be true or 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const page = context.params?.id ? context.params.id : 1
  const characterResponse = await fetch(`https://rickandmortyapi.com/api/character?page=${context.params?.id}`)
  const data = await characterResponse.json()

  return {
    props: {
      page: Number(page),
      response: data,
    },
  };
}

type CharacterProps = {
  response: CharacterResponse
  page: number
}

export default function Home({ response, page }: CharacterProps) {
  return (
    <div className={styles.app}>
      <Head>
        <title>Pokemon App - NextJS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h1>Rick and Morty</h1>
        <div className={styles.characters}>
          {response.results.map((character, index) => (
            <Character {...character} key={index} />
          ))}
          <div>
            <Link href={"/" + (page - 1)}>
              <button disabled={!response?.info.prev}>
                Previous
              </button>
            </Link>
            <Link href={"/" + (page + 1)}>
              <button disabled={!response?.info.next}>
                Next
              </button>
            </Link>
            <p style={{ display: 'inline', color: 'white' }}>{page}/{response?.info.pages}</p>
          </div>
        </div>
      </div>
    </div>
  )
}