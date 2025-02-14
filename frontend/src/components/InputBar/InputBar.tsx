import classes from "./InputBar.module.css"
import birds from "./birds.json"
import { useState, useEffect} from "react";

interface InputBarProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  results: string[];
  setResults: React.Dispatch<React.SetStateAction<string[]>>;
  handleGuess: (guess:string) => void;
}


function InputBar({ input, setInput, results, setResults, handleGuess }:InputBarProps) {

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lowerCaseInput = input.trim().toLowerCase();
    const birdExists = Object.keys(birds).find((bird) => bird.toLowerCase() === lowerCaseInput);
    if (birdExists) {
        const guessId = birds[birdExists];
        const results = await fetch(`http://localhost:5181/api/guess`, 
          {
            method: 'POST', 
            credentials: "include", 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({birdId: guessId})});
        const resultsJSON = await results.json();
        handleGuess(resultsJSON);
    }
}

  const fillBar = (result:string) => {
    setInput(result);
    setResults([]);
    setIsClicked(true)
  }

  return (  
    <div className={classes.wrapper}>
        <div className={classes.inputBar}>
          <input type="text" name="" id="" className={classes.inputText} value={input} onChange={(e) => setInput(e.target.value)}  onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit(e);
          }
        }} placeholder="Enter Your Guess Here"/>
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