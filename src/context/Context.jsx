import { createContext, useState } from "react";
import runChat from "../config/gemini";


export const Context = createContext();

const contextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    //mic input
    const [text, setText] = useState("");
    const [listening, setListening] = useState(false);

    const [image, setImage] = useState(null)



    //typing effect
    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev+nextWord)
        }, 75*index)
    }

    //new chat
    const newChat = (Prompt) => {
        setLoading(false);
        setShowResult(false);
        
        setResultData("");
        setInput("");
        setImage(null);
    }

    const onSent = async (prompt, imgFile) => {
        setResultData("");
        setLoading(true)
        setShowResult(true)

        let response;

        //Determine which prompt & image to send
        const textPrompt = prompt || input;
        const imageFile = imgFile || image;

        response = await runChat(textPrompt, imageFile);

        setRecentPrompt(textPrompt);
        setPrevPrompts((prev) => [...prev, textPrompt]);

        let formattedResponse = response
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // bold
            .replace(/\*(.*?)\*/g, "<i>$1</i>")     // italic
            .replace(/#+\s?/g, "")                  // remove markdown headings ###, ##
            .replace(/---/g, "<hr/>")               // horizontal rules
            .replace(/\n{2,}/g, "</p><p>")          // paragraphs
            .replace(/\n/g, "<br/>");               // single line breaks

        formattedResponse = `<p>${formattedResponse}</p>`;

        //Typing effect word by word
        const words = formattedResponse.split(" ");
        for (let i = 0; i < words.length; i++) {
            const nextWord = words[i];
            delayPara(i, nextWord + " ");
        }

        setLoading(false)
        setInput("")
        setImage(null);
    }

    //microphone
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition;
            
            if(!SpeechRecognition) {
                alert("Speech recognition is not supported in this browser");
            }
    
            const recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            recognition.interimResults = false;
            recognition.continuous = false;
    
            recognition.start();
            setListening(true);
    
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log("Transcript:", transcript);
                setText(transcript)
                setListening(false);
                setInput(transcript)

            }

            recognition.onerror = () => setListening(false);
            recognition.onend = () => setListening(false);
        }

        //image
        const handleImageUpload = (file) => {
            if(file && file.type.startsWith("image/")) {
                setImage(file);
            } else {
                alert("Please upload a valid image file");
            }
        };


    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        startListening,
        image,
        handleImageUpload,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default contextProvider;