import classes from "./InputBar.module.css"
import birds from "./birds.json"
import { useState, useEffect} from "react";

function InputBar() {

  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (input.length >= 2) {
      let lowerQuery = input.toLowerCase();
      lowerQuery.concat('  ');
      const res = Object.keys(birds).filter(bird => bird.toLowerCase().includes(lowerQuery));
      console.log(res);
      setResults(res);
    } else {
      setResults([]);
    }
  }, [input]);


  return (  
    <div className={classes.wrapper}>
        <div className={classes.inputBar}>
            <input type="text" name="" id="" className={classes.inputText} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Your Guess Here"/>
        </div>
    </div>
  )
}

export default InputBar