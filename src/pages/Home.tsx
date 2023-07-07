import {collection, getDocs, deleteDoc, doc} from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { auth, db, storage } from '../config/firebase';
import { Link } from 'react-router-dom';
import { deleteObject, ref } from 'firebase/storage';

interface Props {
  isAuth: boolean;
}

export interface Posts {
  id: string,
  imageUrl: string,
  postText: string,
  title: string;
  author: {
    id: string;
    name: string;
  };
};

const MAX_DESCRIPTION_WORDS = 25;

const Home: React.FC<Props> =  (isAuth) => {
  const [postLists, setPostList] = useState<Posts[]>();
  const postCollectionRef = collection(db, "posts");

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef)
      const posts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Posts[];
      setPostList(posts);
    };

    getPosts();
  });

  const deletePost = async (id: string, imageUrl: string) => {
    const postDoc = doc(db, 'posts', id);
    await deleteDoc(postDoc);
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef)
  };


  return (
    <div>
      
      {postLists?.map((post) => {
         const words = post.postText.split(' ');
         const isDescriptionTooLong = words.length > MAX_DESCRIPTION_WORDS;
         const shortenedDescription = isDescriptionTooLong
           ? words.slice(0, MAX_DESCRIPTION_WORDS).join(' ') + '...'
           : post.postText;

        return (
          <div className='flex flex-col justify-center items-center mt-2 p-5' key={post.id}>
            <div>

            <div className="deletePost ">
                    {isAuth && auth.currentUser?.uid === post.author.id && (
                      <button className='text-2xl  absolute mx:left-1/3 bg-orange-600 p-2 z-10 rounded-full hover:bg-orange-800 hover:p-3 tranisiton-all duration-300'
                        onClick={(e) => {
                          deletePost(post.id, post.imageUrl);
                        }}
                      >
                        &#128465;
                      </button>
                    )}
              </div>
            <Link to={`/post/${post.id}`}>
              <div className='hover:bg-orange-600 hover:rotate-2 duration-500 transition-all flex rounded-xl flex-col justify-center items-center w-full bg-black text-white p-10'>
                <h1 className='text-md text-center font-bold'>{post.title}</h1>
                <img className='w-96 p-5' src={post.imageUrl}></img>
                <div className='p-2 text-md text-center'>{shortenedDescription}</div>
               
                <h3 className='text-right' >@<span className="text-orange-500 font-bold">{post.author.name}</span></h3>
              </div>
            </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Home