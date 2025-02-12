import classes from "./MainPage.module.css"
import InputBar from "../InputBar/InputBar"
import GuessCard from "../GuessCard/GuessCard"
import {useEffect, useState} from "react";
import birds from "../InputBar/birds.json"
function MainPage() {
    const [userState, setUserState] = useState(null);
    const [bird, setBird] = useState(null)
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [curGuess, setCurGuess] = useState("");
    const [guesses, setGuesses] = useState([]); 

    useEffect(() => {
        const getBirdToday = async () => {
            const res = await fetch(`http://localhost:5181/api/bird-today`);
            const birdjson = await res.json();
            console.log(birdjson);
            setBird(birdjson.bird);
        };

        const getUserState = async () => {
            const res = await fetch(`http://localhost:5181/api/gamestate`, {
                method: "GET",
                credentials: "include", 
              });
            const statejson = await res.json();
            console.log(statejson);
            setUserState(statejson.state);
        }

        const getUserGuesses = async () => {
            const res = await fetch(`http://localhost:5181/api/userguesses`);
            const guessesjson = await res.json();
            console.log(guessesjson);
            setGuesses(guessesjson.guesses);
        }

        getBirdToday();
        getUserState();
        getUserGuesses();
    }, []);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        const birdExists = Object.keys(birds).find((bird) => bird.toLowerCase() === input.toLowerCase());
        if (birdExists) {
            setCurGuess(birdExists);
            const guessId = birds[birdMatch];

        }
    }
    if(!bird) {
        return null;
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.gameDiv}>
                    <div className={classes.bird}>
                        <p className={classes.todaysBird}>Today's Bird</p>
                        <div className={classes.imgAndCredit}>
                            <img src={bird.image_url} alt="" className={classes.birdImg} />
                            <p className={classes.credit}>© {bird.image_credit}</p>
                        </div>
                    </div>
                    <InputBar input={input} setInput={setInput} results={results} setResults={setResults} />
                <div className={classes.cardsDiv}>
                    <GuessCard guess={bird} answer={bird}/>
                </div>
            </div>
        </div>
    );
}

export default MainPage