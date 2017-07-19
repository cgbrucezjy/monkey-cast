import React, { Component } from 'react';
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import styles from './videoPageStyles.css';
import 'reset-css/reset.css';
import {extractNumber} from '../../utils/util'
import MovieCard from '../../component/movieCard'
class VideoPage extends Component {
    
    constructor(props){
        super(props)
        console.log(document.getElementById('_source').value)
        console.log(document.getElementById('_contentType').value)
        console.log(document.getElementById('_title').value)
        this.state={
            url:"",
            isSeries:false
        }
    }
    componentDidUpdate(prevProps, prevState){
        window.scrollTo(0, 0)
        console.log(this.props.currState.currMovie.source,prevProps.currState.currMovie.source)
        if(this.refs.video1 && this.props.currState.currMovie.source !=prevProps.currState.currMovie.source)
            this.refs.video1.videoEl.load();
    }
    componentWillMount() {
        console.log(this.props.params.seriesKey)
        if(this.props.params.seriesKey)
        {
            this.props.eventEmitter.emit("movieChanged", {path:'series/'+this.props.params.seriesKey+'/movies/'+this.props.params.movieKey})
            this.setState({isSeries:true,url:'series/'+this.props.params.seriesKey+'/movies/'+this.props.params.movieKey})
        }
        else{
            this.props.eventEmitter.emit("movieChanged", {path:'movies/'+this.props.params.movieKey})
        }
    }
    watchMovie(m){
        this.props.history.push({
                pathname: '/seriesPage/'+this.props.currState.currSeries.key+'/'+m.key
            })
        this.props.eventEmitter.emit("movieChanged", {path:'series/'+this.props.params.seriesKey+'/movies/'+m.key})
    }
    renderMovie()
    {
        
        return (
                Object.keys(this.props.currState.currSeries.movies)
                .sort((a,b)=>parseInt(extractNumber(this.props.currState.currSeries.movies[a].description))-parseInt(extractNumber(this.props.currState.currSeries.movies[b].description)))
                .map((key,i)=>{
                    var m=this.props.currState.currSeries.movies[key]
                    return (
                        <MovieCard key={i} movie={m} watchMovie={this.watchMovie.bind(this,m)}/>
                        )
                })
        )
    }
    renderSeries(){
        console.log("render series")
console.log('curr series movies',this.props.currState.currSeries)
        return (
        <div>
            <div className='card-deck'>
                {this.props.currState.currSeries.movies ? this.renderMovie() : <div>no movies have been added yet</div>}
            </div>
        </div>)
      
    }
    render () {
        
        if(this.props.currState.currMovie.source )
        {
            const {title,contentType,source,description} = this.props.currState.currMovie
            var unix_timestamp = '2'+source.substring(source.indexOf('&start=')+8,source.indexOf('&custom='))
        
            var newUrl = source.substring(0,source.indexOf('&start=')+7)+unix_timestamp+source.substring(source.indexOf('&custom='))
            var s = newUrl
            console.log('is series',this.state.isSeries)
            return (
                <div>
                    <div >
                        Connect to a remote device
                            <button is="google-cast-button" class="castButton"></button>     
                            <h1>{title} </h1>
                            <h3>{description}</h3>
                            {/* <div>
                                <span>If video is no longer avalible try this button and re-enter-></span>
                                <button onClick={this.refreshURL.bind(this)}>MADSKILLZ</button> 
                            </div> */}
                            <div className="videoListItem">
                                 <Video
                                    ref="video1">
                                     <source src={s} type={contentType}/> 
                                    {/* <source src={"http://techslides.com/demos/sample-videos/small.mp4"} /> */}
                                </Video> 
                            </div>
                    </div>
                    <div>
                        {this.state.isSeries?this.renderSeries():<div></div>}
                    </div>
                </div>
            );
        }
        else
        {
            return <div>loading...</div>
        }

    }
}

export default VideoPage;