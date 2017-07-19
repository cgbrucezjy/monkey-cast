/**
 * Copyright (C) 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Shortcut to get element by id.
 * @param {string} name
 * @return {?Element}
 */
function $(name) {
  return document.getElementById(name);
}


/**
 * Remote Player data.
 * @type {!cast.framework.RemotePlayer}
 */
var player;


/**
 * Remote Player controller.
 * @type {!cast.framework.RemotePlayerController}
 */
var playerController;


/**
 * Update seek progress bar.
 */
function updateSeek() {
  $('seekProgress').value = playerController.getSeekPosition(
      player.currentTime, player.duration) || 0;
  $('seekString').innerText =
      playerController.getFormattedTime(player.currentTime) + ' / ' +
      playerController.getFormattedTime(player.duration);
}


/**
 * Update volume progress bar.
 */
function updateVolume() {
  $('volumeProgress').value = Number(player.volumeLevel) * 100;
}


/**
 * Seek click handler.
 * @param {!Event} event
 */
function seekClick(event) {
  if (player.canSeek) {
    var percent = 100 * event.offsetX / $('seekProgress').offsetWidth;
    player.currentTime = playerController.getSeekTime(percent, player.duration);
    playerController.seek();
    updateSeek();
  }
}


/**
 * Volume click handler.
 * @param {!Event} event
 */
function volumeClick(event) {
  if (player.isConnected) {
    player.volumeLevel = event.offsetX / $('volumeProgress').offsetWidth;
    playerController.setVolumeLevel();
    updateVolume();
  }
}

// $('playerControl').hidden = true;
/**
 * Initialize cast service.
 * @param {boolean} isAvailable
 * @param {?string} reason
 */
window['__onGCastApiAvailable'] = function(isAvailable, reason) {


  // Init cast
  cast.framework.CastContext.getInstance().setOptions({
    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  });

  // Init player controller
  player = new cast.framework.RemotePlayer();;
  playerController = new cast.framework.RemotePlayerController(player);


  // Listen to player properties changes
  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, function() {
        $('muteButton').disabled = !player.isConnected;
        $('playerControl').hidden = !player.isConnected;
        var videoElement = $('videoElement');
        if (player.isConnected) {
          // Continue playing remotely what is playing locally.
          // if (videoElement.src) {
          //   // If local playback is done, do not play on remote
          //   if (videoElement.currentTime < videoElement.duration) {
          //     playRemote(
          //         getMediaIndex(videoElement.src), videoElement.currentTime,
          //         videoElement.paused);
          //     videoElement.removeAttribute('src');
          //     videoElement.load();
          //   }
          // }
        } else {
          // Continue playing locally what is playing remotely.
          if (player.savedPlayerState && player.savedPlayerState.mediaInfo) {
            var mediaId =
                getMediaIndex(player.savedPlayerState.mediaInfo.contentId);
            if (mediaId >= 0) {
              playLocally(
                  mediaId, player.savedPlayerState.currentTime,
                  player.savedPlayerState.isPaused);
            } else {
              console.log(
                  'Unknown media is playing ' +
                  player.savedPlayerState.mediaInfo.contentId);
            }
          }
        }

      });

  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, updateSeek);
  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.DURATION_CHANGED, updateSeek);
  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED, updateVolume);

  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED, function() {
    $('playPauseButton').innerText = player.isPaused ? 'Play' : 'Pause';
  });

  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED, function() {
    $('muteButton').innerText = player.isMuted ? 'Unmute' : 'Mute';
  });

  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.CAN_PAUSE_CHANGED, function() {
    $('playPauseButton').disabled = !player.canPause;
  });

  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.IMAGE_URL_CHANGED, function() {
    $('mediaImage').src = player.imageUrl;
    $('mediaImage').hidden = !player.imageUrl;
  });

  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.STATUS_TEXT_CHANGED, function() {
    $('statusText').innerText = player.statusText;
  });

  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.TITLE_CHANGED, function() {
    $('mediaTitle').innerText = $('_title').value;
    
  });

  playerController.addEventListener(
      cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED, function() {
    var newVal = player.mediaInfo;
    var subtitle =
        (newVal && newVal.metadata && newVal.metadata.subtitle) || '';
    $('mediaDesc').innerText = subtitle;
  });
};


var MEDIA_SOURCE_ROOT =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';


/**
 * Available media.
 */
var MEDIA_CONTENT = [
  {
    'source': MEDIA_SOURCE_ROOT + 'BigBuckBunny.mp4',
    'title': 'Big Buck Bunny',
    'subtitle': 'By Blender Foundation',
    'thumb': MEDIA_SOURCE_ROOT + 'images/BigBuckBunny.jpg',
    'contentType': 'video/mp4',
    'description': 'Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain\'t no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org'
  },
  {
    'source': MEDIA_SOURCE_ROOT + 'Sintel.mp4',
    'title': 'Sintel',
    'subtitle': 'By Blender Foundation',
    'thumb': MEDIA_SOURCE_ROOT + 'images/Sintel.jpg',
    'contentType': 'video/mp4',
    'description' : 'Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender. With initial funding provided by 1000s of donations via the internet community, it has again proven to be a viable development model for both open 3D technology as for independent animation film.\nThis 15 minute film has been realized in the studio of the Amsterdam Blender Institute, by an international team of artists and developers. In addition to that, several crucial technical and creative targets have been realized online, by developers and artists and teams all over the world.\nwww.sintel.org'
  }
];

function getMediaIndex(source) {
  for (var i = 0; i < MEDIA_CONTENT.length; i++) {
    if (MEDIA_CONTENT[i]['source'] == source) {
      return i;
    }
  }
  return -1;
}

/**
 * Start playing media on remote device.
 * @param {number} mediaIndex Media index.
 */
function playMedia(mediaIndex) {
  if (player.isConnected) {
    playRemote(mediaIndex, 0, false);
  } else {
    playLocally(mediaIndex, 0, false);
  }
}

/**
 * Play media on remote device.
 * @param {number} mediaIndex Media index.
 * @param {number} currentTime Seek time into the media.
 * @param {boolean} isPaused Media will start paused if true;
 */
function playRemote(currentTime, isPaused) {
  var session = cast.framework.CastContext.getInstance().getCurrentSession();
  if (session) {
    //var content = MEDIA_CONTENT[mediaIndex];
    var mediaInfo = new chrome.cast.media.MediaInfo(
        $('_source').value, $('_contentType').value)
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.title = $('_title').value;
    //mediaInfo.metadata.images = [{'url': content['thumb']}];
    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.currentTime = currentTime;
    request.autoplay = !isPaused;
    session.loadMedia(request).then(
        function() {
          console.log('Load succeed');

        },
        function(e) {
          console.log('Load failed ' + e);
        });
      console.log($('_next').innerHTML)
      var queueingItems = JSON.parse($('_next').innerHTML)
      console.log(queueingItems)
      queueingItems=queueingItems.map(m=>{
        var mediaInfo = new chrome.cast.media.MediaInfo(
    m.source, m.contentType)
        mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
        mediaInfo.metadata.title = m.description;
        var q = new chrome.cast.media.QueueItem(mediaInfo)
        q.autoplay=true
        return q
      })
      console.log(session)
      qloadRequest=new chrome.cast.media.QueueLoadRequest(queueingItems)
      console.log(qloadRequest)
      session.queueLoad(qloadRequest).then(function(){
        console.log("loaded success")
      })
  }
}


/**
 * Play media on local player.
 * @param {number} mediaIndex Media index.
 * @param {number} currentTime Seek time into the media.
 * @param {boolean} isPaused Media will start paused if true;
 */
function playLocally(mediaIndex, currentTime, isPaused) {
  var content = MEDIA_CONTENT[mediaIndex];
  var videoElement = $('videoElement');
  videoElement.src = content['source'];
  videoElement.currentTime = currentTime;
  videoElement.load();
  if (isPaused) {
    videoElement.pause();
  } else {
    videoElement.play();
  }
}