import logo from './logo.svg';
import './App.css';
import Header from './layouts/Header';
import Nav from './layouts/Nav';
import NewPost from './layouts/NewPost';
import PostPage from './layouts/PostPage';
import About from './layouts/About';
import Missing from './layouts/Missing';
import Footer from './layouts/Footer';
import Home from './layouts/Home';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Route, Routes, useNavigate } from 'react-router-dom';
import api from "./api/posts";
import EditPost from './layouts/EditPost';

function App() {

  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const navigate = useNavigate('/');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responce = await api.get('/posts');
        setPosts(responce.data);
      }
      catch (err) {
        if (err.responce) {
          console.log(err.responce.data);
          console.log(err.responce.status);
          console.log(err.responce.headers);
        }
        else {
          console.log(`Error: ${err.message}`);
        }
      }
    }
    fetchPosts();
  }, [])

  useEffect(() => {
    const filterResults = posts.filter((post) =>
      ((post.body).toLowerCase()).includes(search.toLowerCase()) ||
      ((post.title).toLowerCase()).includes(search.toLowerCase()));
    setSearchResults(filterResults.reverse());
  }, [posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const responce = await api.post('posts', newPost)
      const allPost = [...posts, responce.data]
      setPosts(allPost);
      setPostTitle('')
      setPostBody('')
      navigate('/')
    }
    catch (err) {
      if (err.responce) {
        console.log(err.responce.data);
        console.log(err.responce.status);
        console.log(err.responce.headers);
      }
      else {
        console.log(`Error: ${err.message}`);
      }
    }
  }

  const handleDelete =async (id) => {
    try {
      await api.delete(`posts/${id}`)
      const postLists = posts.filter(post => post.id !== id);
      setPosts(postLists);
      navigate('/')
    }
    catch (err) {
      if (err.responce) {
        console.log(err.responce.data);
        console.log(err.responce.status);
        console.log(err.responce.headers);
      }
      else {
        console.log(`Error: ${err.message}`);
      }
    }
  }

  const handleEdit =async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatePost = { id, title: editTitle, datetime, body: editBody };

    try {
      const responce = await api.put(`/posts/${id}`, updatePost)
      setPosts(posts.map(post => post.id===id ? {...responce.data}:post));
      // const allPost = [...posts]
      // setPosts(allPost);
      setEditTitle('')
      setEditBody('')
    }
    catch (err) {
      if (err.responce) {
        console.log(err.responce.data);
        console.log(err.responce.status);
        console.log(err.responce.headers);
      }
      else {
        console.log(`Error: ${err.message}`);
      }
    }navigate('/')
    //post,setEditTitle,setEditBody
  }

  /*.....................*/


  return (
    <div className="App">
      <Header title="Mini Social Media" />
      <Nav
        search={search}
        setSearch={setSearch}
      />
      <Routes>
        <Route path='/' element={<Home
          posts={searchResults} />} />
        <Route path='/post'>
          <Route index element={<NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />} />
          <Route path=":id" element={<PostPage posts={posts} handleDelete={handleDelete} />} />
        </Route>
        <Route path = "/edit/:id" 
        element = {<EditPost
          handleEdit={handleEdit} 
          posts={posts} 
          editTitle={editTitle} 
          setEditTitle={setEditTitle} 
          editBody={editBody} 
          setEditBody={setEditBody}
        />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />

    </div>
  );
}

export default App;
