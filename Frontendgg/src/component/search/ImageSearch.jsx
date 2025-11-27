import React, { useEffect, useRef, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setImageSearch ,searchByImage , describeImage} from "../../store/features/searchSlice";
import { setImgSearchActive } from '../../store/features/uiSlice';
const ImageSearch = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading]  = useState(false);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
 


    const handleImageUpload = (e)=>{
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        dispatch(setImageSearch(file.name));
    }

    const handleDragOver = (e) =>{
        e.preventDefault();
    }
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if(file && file.type.startsWith('image/')){
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            dispatch(setImageSearch(file.name));
        }
    }

    const handleClickUpload = () =>{
        fileInputRef.current.click();
    }

    const handleSearch = async(e) =>{
        e.preventDefault();
        if(!imageFile) return;
        setIsLoading(true);
        try{
        //  await dispatch(searchByImage(imageFile));
           await Promise.all([
                dispatch(searchByImage(imageFile)).unwrap(),
                dispatch(describeImage(imageFile)).unwrap(),
                ]);
        }
        catch(error){
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect( () => {
        dispatch(setImgSearchActive(true));
        return () => {
            dispatch(setImgSearchActive(false));
        }
    },
    [dispatch]
    );

  return (
    <div className='image-search-container'>
        <form onSubmit={handleSearch}>
            <div className='image-uploader' 
            onDragOver={handleDragOver}
             onDrop={handleDrop}
             onClick={handleClickUpload} >
             {imagePreview ? (
                <img src={imagePreview} alt='Preview' className='image-preview' />
             ) : (
                <>
                <svg
                xmlns='http://www.w3.org/2000/svg'
                width= '40'
                height= '40'
                viewBox='0 0 24 24'
                fill='none'
                stroke='grey'
                strokeWidth='1'
                >
                    <rect x='3' y ='3' width='18' height='18' rx='2' ry='2' />
                    <circle  cx='8.5' cy='8.5' r='1.5' />
                    <polyline points='21 15 16 10 5 21' />
                </svg>
                <div>
                    Drag an image here OR {" "}
                    <span style={{color:"yellow"}}>
                        {" "}
                        choose an image to search for products
                    </span>
                </div>
                </> 
             )}

             <input type="file"
             accept='image/*'
             onChange={handleImageUpload}
             style={{display:"none"}}
             ref = {fileInputRef}
             />
            </div>
            <div className='mt-2 mb-4'>

                <button className='image-search-button' disabled={isLoading} >
                    {
                        isLoading? (
                            <>
                            {" "}
                            <Spinner
                            animation='border'
                            size='sm'
                            color='#a88c3d'
                            />
                            Searching for similar products...
                            </>
                        ) : (
                            "Search"
                        )
                    }

                </button>

            </div>
        </form>
      
    </div>
  )
}

export default ImageSearch
