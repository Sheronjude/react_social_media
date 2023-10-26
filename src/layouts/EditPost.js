import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

const EditPost = ({handleEdit,posts,editTitle,setEditTitle,editBody,setEditBody}) => {
    const { id } = useParams();

    const post = posts.find(post=> (post.id).toString() ===id);

    useEffect(()=>{
        if(post){
            setEditTitle(post.title)
            setEditBody(post.body)
        }
    },[])

    
  return (
    <main className='NewPost' >
      <h2>Edit Post</h2>
      <form className='newPostForm' onSubmit={(e)=> e.preventDefault()} >
        <label htmlFor='postTitle'>Title:</label>
        <input
          id='posttitle'
          type='text'
          required
          value={editTitle}
          onChange={(e)=> setEditTitle(e.target.value)}
          />
        <label htmlFor='postBody'>Body:</label>
        <input
          id='postBody'
          type='text'
          required
          value={editBody}
          onChange={(e)=> setEditBody(e.target.value)}
          />
          <button type='submit'onClick={()=>handleEdit(post.id)} >Save Changes</button>
      </form>
    </main>
  )
}

export default EditPost
