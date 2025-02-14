import classes from "./MainPage.module.css"
import InputBar from "../InputBar/InputBar"
import GuessCard from "../GuessCard/GuessCard"
import {useEffect, useState} from "react";
import EndingScreen from "../EndingScreen/EndingScreen";

function MainPage() {
    interface Bird{
        common_name: string;
        scientific_name: string;
        genus: string;
        species: string;
        order: string;
        family: string;
        [key:string]: string|boolean;
    }

    const [userState, setUserState] = useState(null);
    const [bird, setBird] = useState<Bird|null>(null)
    const [input, setInput] = useState<string>("");
    const [results, setResults] = useState([]);
    const [guesses, setGuesses] = useState([]); 

    useEffect(() => {
        const getBirdToday = async () => {
            const res = await fetch(`http://localhost:5181/api/bird-today`);
            const birdjson = await res.json();
            setBird(birdjson.bird);
        };

        const getUserState = async () => {
            const res = await fetch(`http://localhost:5181/api/gamestate`, {
                method: "GET",
                credentials: "include", 
              });
            const statejson = await res.json();
            setUserState(statejson.state);
        }

        const getUserGuesses = async () => {
            const res = await fetch(`http://localhost:5181/api/userguesses`);
            const guessesjson = await res.json();
            setGuesses(guessesjson.guesses);
        }

        getBirdToday();
        getUserState();
        getUserGuesses();
    }, []);

    const handleGuess = (resBody) => {
        console.log(resBody.state);
        setUserState(resBody.state)
        if (resBody.state === "ONGOING"){
            setGuesses((prevGuesses) => [...prevGuesses, resBody.bird]);
        }
    }

    if(!bird || !userState) {
        return null;
    }

    return userState === "ONGOING" ?
        (
        <div className={classes.wrapper}>
            <div className={classes.gameDiv}>
                    <div className={classes.bird}>
                        <p className={classes.todaysBird}>Today's Bird</p>
                        <div className={classes.imgAndCredit}>
                            <img src={bird.image_url} alt="" className={classes.birdImg} />
                            <p className={classes.credit}>© {bird.image_credit}</p>
                        </div>
                    </div>
                    <InputBar input={input} setInput={setInput} results={results} setResults={setResults} handleGuess={handleGuess} />
                <div className={classes.cardsDiv}>
                    {
                        guesses.map((guess, index) => (
                            <GuessCard key={index} guess={guess} answer={bird}/>
                        ))
                    }
                </div>
            </div>
        </div>
    ):(
        <EndingScreen bird={bird} state={userState}/>
    );
}

export default MainPage