import React, { useRef } from 'react';
import { FrameContextConsumer } from 'react-frame-component';
// import Iframe from 'react-iframe-click';
import IframeComm from "react-iframe-comm";




const Video = (props) => {
    // the html attributes to create the iframe with
    // make sure you use camelCase attribute names
    const attributes = {
        src: "https://pbojinov.github.io/iframe-communication/iframe.html",
        src: "",
        width: "100%",
        height: "175",
        frameBorder: 1, // show frame border just for fun...
    };

    // the postMessage data you want to send to your iframe
    // it will be send after the iframe has loaded
    const postMessageData = "hello iframe";

    // parent received a message from iframe
    const onReceiveMessage = () => {
        console.log("onReceiveMessage");
    };

    // iframe has loaded
    const onReady = () => {
        console.log("onReady");
    };

    // const frameWindow = useRef(null);
    // const getInnerHTML = () => {
    //     const iframeWindow = frameWindow.current;
    //     if(!iframeWindow) return;

    //     // here you got the iframe window object
    //     // work with it as you like
    // };

    return (
        <div>


            <video width="470" height="250" controls="controls" >
                <source src="http://www.youtube.com/embed/xDMP3i36naA" type="video/ogg" />
                <source src="http://www.youtube.com/embed/xDMP3i36naA" type="video/mp4" />
                {/* <embed src="http://www.youtube.com/embed/xDMP3i36naA" width="470" height="250"/> */}
                Your browser does not support the video tag.


            </video>

        </div>
    );
}





export default Video;
