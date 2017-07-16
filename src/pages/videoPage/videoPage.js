import React, { Component } from 'react';
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import styles from './videoPageStyles.css';
import 'reset-css/reset.css';

class VideoPage extends Component {
    
    constructor(props){
        super(props)
        console.log(document.getElementById('_source').value)
        console.log(document.getElementById('_contentType').value)
        console.log(document.getElementById('_title').value)
        this.state={
            url:""
        }
    }
    componentWillMount() {
        console.log(this.props.params.seriesKey)
        if(this.props.params.seriesKey)
        {
            this.props.eventEmitter.emit("movieChanged", {path:'series/'+this.props.params.seriesKey+'/movies/'+this.props.params.movieKey})
            this.setState({url:'series/'+this.props.params.seriesKey+'/movies/'+this.props.params.movieKey})
        }
        else{
            this.props.eventEmitter.emit("movieChanged", {path:'movies/'+this.props.params.movieKey})
            this.setState({url:'movies/'+this.props.params.movieKey})
        }
    }
    refreshURL(){
        this.props.eventEmitter.emit("refresh", {url:this.state.url})
        this.props.history.goBack()
    }
    render () {
        
        if(this.props.currState.currMovie.source )
        {
            const {title,contentType,source,description} = this.props.currState.currMovie
            var unix_timestamp = '2'+source.substring(source.indexOf('&start=')+8,source.indexOf('&custom='))
        
            var newUrl = source.substring(0,source.indexOf('&start=')+7)+unix_timestamp+source.substring(source.indexOf('&custom='))
            var s = newUrl
            console.log(s)
            return (
                
                <div >
                    Connect to a remote device
                        <button is="google-cast-button" class="castButton"></button>     
                        <h1>{title} </h1>
                        <h3>{description}</h3>
                        <div>
                            <span>If video is no longer avalible try this button and re-enter-></span>
                            <button onClick={this.refreshURL.bind(this)}>MADSKILLZ</button> 
                        </div>
                        <div className="videoListItem">
                            <Video
                                ref="video1">
                                <source src={s} type={contentType}/>
                            </Video>
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