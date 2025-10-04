import React, { useContext, useRef } from 'react'
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const Main = () => {

    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input, startListening, handleImageUpload, image} = useContext(Context);

    const fileInputRef = useRef(null);
    // open file dialog
    const openFilePicker = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    return (
    <div className="main">
        <div className="nav">
            <p>Gemini 2.5</p>
            <img src={assets.user_icon} alt="" />
        </div>

        <div className="main-container">

            {!showResult ?
            <>
                <div className="greet">
                    <p className='first'><span>Hello, Dev</span></p>
                    <p>What should we do today?</p>
                </div>
            </> 
            :   <div className='result'>
                   <div className="result-title">
                        <img src={assets.user_icon} alt="" />
                        <p>{recentPrompt}</p>
                    </div> 
                    <div className="result-data">
                        <img src={assets.gemini_icon} alt="" />
                        {loading
                        ?<div className='loader'>
                            <hr />
                            <hr />
                            <hr />
                        </div>
                        : <p dangerouslySetInnerHTML={{__html:resultData}}></p>
                        }
                    </div>
                </div>
            }

            <div className="main-bottom">
                <div className="search-box">
                    <input
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onSent();
                        }
                    }} 
                    value={input} 
                    type="text" placeholder={"Enter prompt here"}/>
                    <div>
                        <img onClick={openFilePicker} src={assets.gallery_icon} alt="upload" />
                        <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        style={{display: "none"}}
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                        />
                        {image && (
                            <img
                            src={URL.createObjectURL(image)}
                            alt="preview"
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "4px",
                            }}
                            />
                        )}

                        <img onClick={startListening} src={assets.mic_icon} alt="mic" />

                        {input? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                    </div>
                </div>
                <p className='bottom-info'>Gemini can make mistakes, so double-check its responses</p>
            </div>
        </div>
    </div>
  )
}

export default Main