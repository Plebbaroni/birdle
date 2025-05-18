import classes from "./InputBar.module.css"
import birdsData from "./birds.json"
import { useState, useEffect} from "react";
interface Bird{
  common_name: string;
  scientific_name: string;
  genus: string;
  species: string;
  order: string;
  family: string;
  image_url:string;
  [key:string]: string|boolean;
}
interface resBodyType {
  state: string;
  bird: Bird;
}
interface InputBarProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  results: string[];
  setResults: React.Dispatch<React.SetStateAction<string[]>>;
  handleGuess: (resBody: resBodyType) => void;
}


function InputBar({ input, setInput, results, setResults, handleGuess }:InputBarProps) {
  const birds:Record<string, number> = birdsData;
  const [isClicked, setIsClicked] = useState<boolean>(false);
  let API_URL = import.meta.env.VITE_API_URL;
    if (API_URL == null) {
        API_URL = "http://localhost:5181";
    }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lowerCaseInput = input.trim().toLowerCase();
    const birdExists = Object.keys(birds).find((bird) => bird.toLowerCase() === lowerCaseInput);
    if (birdExists) {
        const guessId = birds[birdExists];
        const results = await fetch(`${API_URL}/api/guess`, 
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
    setInput('');
}

  const fillBar = (result:string) => {
    setInput(result);
    setResults([]);
    setIsClicked(true)
  }

  return ( 
    <div className={classes.wrapper}>
        <div className={classes.inputBar}>
          <form onSubmit={handleSubmit} className={classes.inputForm}>
            <input type="text" name="" id="" className={classes.inputText} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Your Guess Here"/>
          </form>
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