import React, { Component } from 'react';
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import styles from './videoPageStyles.css';
import 'reset-css/reset.css';

class VideoPage extends Component {
    
    constructor(props){
        super(props)
        this.ips = ["104.198.200.28","70.35.197.74","104.198.234.21"]
        console.log(document.getElementById('_source').value)
        console.log(document.getElementById('_contentType').value)
        console.log(document.getElementById('_title').value)
    }
    componentWillMount() {
        console.log(this.props.params.seriesKey)
        if(this.props.params.seriesKey)
        {
            this.props.eventEmitter.emit("movieChanged", {path:'series/'+this.props.params.seriesKey+'/movies/'+this.props.params.movieKey})
            
        }
        else{
            this.props.eventEmitter.emit("movieChanged", {path:'movies/'+this.props.params.movieKey})
        }
    }
    
    render () {
        
        if(this.props.currState.currMovie.source )
        {
            const {title,contentType,source,description} = this.props.currState.currMovie
            var s = source
            console.log(s)
            return (
                
                <div >
                    Connect to a remote device
                        <button is="google-cast-button" class="castButton"></button>     
                        <h1>{title} </h1>
                        <h3>{description}</h3>
                        <Video
                            
                            ref="video1">
                            <source src={s} type={contentType} />
                        </Video>

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