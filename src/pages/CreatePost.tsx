import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth, storage } from "../config/firebase"; // Import storage from Firebase config
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

interface Props {
  isAuth: boolean;
}

const CreatePost: React.FC<Props> = ({ isAuth }) => {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);


  const postCollectionRef = collection(db, "posts");
  const navigate = useNavigate();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImageFile(file);
    }
  };

  const createPost = async () => {
    if (title.trim() === "" || postText.trim() === "") {
      toast.warn("Please fill in all fields.", {
        position: toast.POSITION.TOP_CENTER,
        theme: "dark",
      });
    } else if (!imageFile) {
      toast.warn("Please upload an image.", {
        position: toast.POSITION.TOP_CENTER,
        theme: "dark",
      });
    } else {
      let imageUrl = "";
      if (imageFile) {
        const storageRef = ref(storage, "images/" + imageFile.name); // Use storage from the Firebase SDK
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        await uploadTask.on(
          "state_changed",
          () => {
            // Handle progress or any state change events
          },
          (error) => {
            console.error(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            imageUrl = downloadURL;

            await addDoc(postCollectionRef, {
              title,
              postText,
              imageUrl,
              author: {
                name: auth.currentUser?.displayName,
                id: auth.currentUser?.uid,
              },
            });

            toast.success("Success Notification. Go to the Home Page to View the Post!", {
              position: toast.POSITION.TOP_CENTER,
              theme: "dark",
            });
          }
        );
      } else {
        await addDoc(postCollectionRef, {
          title,
          postText,
          author: {
            name: auth.currentUser?.displayName,
            id: auth.currentUser?.uid,
          },
        });

        toast.success("Success Notification. Go to the Home Page to View the Post!", {
          position: toast.POSITION.TOP_CENTER,
          theme: "dark",
        });
      }
    }
  };

    useEffect(() => {
      if (!isAuth) {
        navigate("/login")
      }
    })

    return (
      <div className="flex justify-center items-center flex-col p-5">
      <div className="p-5 rounded-2xl bg-black text-white w-full sm:w-1/2">
        <h1 className="text-center text-2xl font-bold">Create Post</h1>
        <div className="flex flex-col gap-3 p-3">
          <label className="text-xl font-bold">Title:</label>
          <input className="hover:border-orange-600 duration-300 placeholder:italic p-4 rounded-md text-white border-2 border-white focus:outline-none focus:ring focus:ring-gray-800 bg-transparent"
          onChange={(event) => {setTitle(event.target.value)}}
          placeholder="Title..." 
          value={title} />
        </div>
        <div className="flex justify-center flex-col gap-3 p-4 ">
          <label className="text-xl font-bold">Description:</label>
          <textarea className="hover:border-orange-600 duration-300 resize-none h-40 placeholder:italic p-2 rounded-md text-white border-2 border-white focus:outline-none focus:ring focus:ring-gray-800 bg-transparent "
          onChange={(event) => {setPostText(event.target.value)}}
          placeholder="Description..." value={postText}/>
          </div>
          <div className="flex justify-center items-center p-3">
            <input
              className="file:p-3 text-sm
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-black file:transition-all file:duration-200
              file:hover:bg-transparent file:hover:text-white file:hover:border-x-2 file:hover:border-orange-600"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>  
          <div className="flex justify-center mt-2">
            <button onClick={createPost} className="border-2 border-white p-3 rounded-lg w-1/3 transition-all duration-300 hover:border-orange-600">Post</button>
            <ToastContainer />
          </div>  
      </div>
      </div>
    )
  }
  
  export default CreatePost