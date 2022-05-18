import { gql, useQuery } from '@apollo/client'
import styles from '../styles/Home.module.css'


const GET_BOOKS = gql`
  query GetBooks {
  books {
    title
    author
  }
}`

export default function Home() {
  const {loading, error, data} = useQuery(GET_BOOKS)
  console.log(data)


  if(loading){
    <div>Loading...</div>
  }
  if(error){
    <div style={{color:'red'}}>Error happened</div>
  }

  return (
    <div className={styles.container}>
      <h1>Books</h1>
      {data?.books?.map(book=>(
        <div className={styles.book} key={book.title}>
          <h3 className={styles.title}>{book.title}</h3>
          <h4 className={styles.author}>{book.author}</h4>
        </div>
      ))}
    </div>
  )
}
Home.properties = {
  title: 'Home',
  description: 'Home page description',
}