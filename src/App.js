//import logo from './hmm.png';
import './App.css';
import { useState } from 'react';

function Header(props){
  return <header>
  <h1><a href="/" onClick={function(event){
    event.preventDefault();
    props.onChangeMode();
  }}>{props.title}</a></h1> 
 </header>
}

function Nav(props){
  const list =[]
  for(let i=0;i<props.topics.length;i++){
    let t = props.topics[i];
    list.push(<li key={t.id}>
      <a id={t.id} href={"/read/"+t.id} onClick={function(event){
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
    <ul>
      {list}
    </ul>
  </nav>
}

function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={function(event){
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type='text' name='title' placeholder='title'/></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type='submit' value='create'/></p>
    </form>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={function(event){
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type='text' name='title' placeholder='title' value={title} onChange={function(event){
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name='body' placeholder='body' value={body} onChange={function(event){
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type='submit' value='Update'/></p>
    </form>
  </article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(5);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'js is ...'},
    {id:4, title:'react', body:'react is ...'}
  ])

  let content = null;
  let contextControl = null;
  if(mode==='WELCOME'){
    content=<Article title="Welcome" body="Hello, WEB"></Article>
  }else if(mode==='READ'){
    let title, body = null;
    for(let i=0; i<topics.length;i++){
      if(topics[i].id===id){
        title=topics[i].title;
        body=topics[i].body;
      }
    }
    content=<Article title={title} body={body}></Article>
    contextControl = <>
    <li><a href={"/update"+id} class='btn' onClick={(function(event){
      event.preventDefault();
      setMode('UPDATE');
    })}>Update</a></li>
    <li><input type='button' value="Delete" onClick={function(){
      const newtopics = [];
      for(let i=0; i<topics.length; i++){
        if(topics[i].id !== id){
          newtopics.push(topics[i]);
        }
      }
      setTopics(newtopics);
      setMode('WELCOME');
    }} class='btn' /></li>
    </>
  } else if(mode==='CREATE'){
    content = <Create onCreate={function(_title, _body){
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length;i++){
      if(topics[i].id===id){
        title=topics[i].title;
        body=topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={function(title, body){
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }

  return (
<div>
  <Header title="WEB" onChangeMode={function(){
    setMode('WELCOME');
  }}></Header>
  <Nav topics={topics} onChangeMode={function(_id){
    setMode('READ');
    setId(_id);
  }}></Nav>
  {content}
  <ul>
  <li><a href="/create" onClick={function(event){
    event.preventDefault();
    setMode('CREATE');
  }} class='btn'>create</a></li>
  {contextControl}
  </ul>
</div>
  );
}

export default App;
