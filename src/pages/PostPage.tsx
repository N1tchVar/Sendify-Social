import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Posts } from './Home';

interface PostPageProps {
  postId: string;
}

const PostPage: React.FC<PostPageProps> = ({ }) => {
  const { id } = useParams<{ id: string | any }>();
  const [post, setPost] = useState<Posts | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDocRef = doc(db, 'posts', id);
        const postDocSnap = await getDoc(postDocRef);

        if (postDocSnap.exists()) {
          const postData = postDocSnap.data();
          const fetchedPost: Posts = {
            id: postDocSnap.id,
            title: postData.title,
            postText: postData.postText,
            imageUrl: postData.imageUrl,
            author: {
              id: postData.author.id,
              name: postData.author.name
            },
          };
          setPost(fetchedPost);
        } else {
          console.log('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div className='text-white flex justify-center items-center p-5 text-5xl'>Loading...</div>;
  }

  return (
    <div className='mt-2 rounded-lg flex justify-center items-center '>
      <div className='text-white flex flex-col justify-center items-center mt-2 bg-black p-6 md:w-1/2 md:p-6 sm:text-center'>
        <h1 className='sm:text-4xl text-2xl text-center p-6 font-bold sm:text-center'>{post.title}</h1>
        <p className='p-3 text-2xl text-center'>{post.postText}</p>
        <img className='sm:w-full sm:p-3' src={post.imageUrl}></img>
        <p className='p-6 font-bold'>Author: <span className='text-orange-600'>@{post.author.name}</span> </p>
      </div>
    </div>
  );
};

export default PostPage;
