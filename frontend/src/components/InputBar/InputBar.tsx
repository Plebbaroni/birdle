import classes from "./InputBar.module.css"
import birds from "./birds.json"
import { useState, useEffect} from "react";

interface InputBarProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  results: string[];
  setResults: React.Dispatch<React.SetStateAction<string[]>>;
}


function InputBar({ input, setInput, results, setResults }:InputBarProps) {

  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    if (input.length >= 2) {
      const lowerQuery = input.toLowerCase();
      lowerQuery.concat('  ');
      const res = Object.keys(birds).filter(bird => bird.toLowerCase().includes(lowerQuery));
      setResults(res);
      setIsClicked(false);
    } else {
      setResults([]);
    }
  }, [input, setResults]);

  const fillBar = (result:string) => {
    setInput(result);
    setResults([]);
    setIsClicked(true)
  }

  return (  
    <div className={classes.wrapper}>
        <div className={classes.inputBar}>
          <input type="text" name="" id="" className={classes.inputText} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Your Guess Here"/>
          {results.length > 0 && !isClicked && (
            <ul className={classes.resultsList}>
              {results.map((result, index) => (
                <li key={index} className={classes.resultItem} onClick={() => fillBar(result)}>
                  {result}
                </li>
              ))}
            </ul>
          )}
        </div>
    </div>
  )
}

export default InputBar