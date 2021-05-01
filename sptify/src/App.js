import React,{useState,useEffect} from 'react';
import './App.css';
import { Credentials } from './Credentials';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';

const Item=(props)=>{
  return (
    <div className='item-wrapper'>
      <div className='image'>
           <img src={props.img}/>
      </div>
      <div className='info'>
        <span className='song-name'>{props.name}</span><br/>
        <span className='artist'>{props.artist}</span><br/>
        <span className='type'>{props.type}</span><br/>
        <span>release on {props.rel}</span><br/>
      </div>

      <div className='button-wrapper'>
      <a href={props.link} target='_blank'><button className='play-button'>Listen</button></a>
      </div>
    </div>
  )
}


function App() {
  const [token, setToken] = useState(null);  
  const [song,setSong]=useState([])
  const spotify = Credentials();  
  var spotifyApi = new SpotifyWebApi();
 useEffect(() => {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => { 
      spotifyApi.setAccessToken(tokenResponse.data.access_token)     
      setToken(tokenResponse.data.access_token);  
    });
  }, [spotify.ClientId, spotify.ClientSecret]); 

  async function searchSong(name)
   {
    if (name==''|| name==null) 
       {alert('Plase enter name first')
       return}
   await spotifyApi.searchTracks(name, { limit: 10 })
    .then(res=>{
      setSong(res.tracks.items)
    })
    .catch(err=>{console.log(err)})
    
   }

   const getSong=()=>{
    let list=[]
     song.map((element,index)=>{
       list.push( <Item key={index} name={element.name} artist={element.artists[0].name} type={element.type} rel={element.album.release_date}
        img={element.album.images[0].url}
        link={element.external_urls.spotify}
       />)
     })
     if(list.length==0)
     {
       return <span style={{textAlign:'center',fontSize:20,color:'white',fontWeight:'bold',display:'block',margin:'auto'}}>No result found</span>
     }
     return list;
   }

  return (
    <>
    <div className='search_wrapper'>
      <input className='search_input' id='search' placeholder='Enter the song name you want to listen'/>
      <button className='search_button' onClick={()=>searchSong(document.getElementById('search').value)}>Search</button>
    </div>
   <div className='item-container'>
     {getSong()}
   </div>

  </>

  );
}

export default App;
