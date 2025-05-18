import classes from "./MainPage.module.css"
import InputBar from "../InputBar/InputBar"
import GuessCard from "../GuessCard/GuessCard"
import {useEffect, useState, useRef} from "react";
import EndingScreen from "../EndingScreen/EndingScreen";
import {motion} from "framer-motion"

function MainPage() {
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
    const [userState, setUserState] = useState<string>("");
    const [bird, setBird] = useState<Bird|null>(null)
    const [input, setInput] = useState<string>("");
    const [results, setResults] = useState<string[]>([]);
    const [guesses, setGuesses] = useState<Bird[]>([]);
    const cardsRef = useRef<HTMLDivElement>(null);
    let API_URL = import.meta.env.VITE_API_URL;
    if (API_URL == null) {
        API_URL = "http://localhost:5181";
    }

    useEffect(() => {
        const getBirdToday = async () => {
            const res = await fetch(`${API_URL}/api/bird-today`);
            const birdjson = await res.json();
            setBird(birdjson.bird);
        };

        const getUserState = async () => {
            const res = await fetch(`${API_URL}/api/gamestate`, {
                method: "GET",
                credentials: "include",
              });
            const statejson = await res.json();
            setUserState(statejson.state);
        }

        const getUserGuesses = async () => {
            const res = await fetch(`${API_URL}/api/userguesses`);
            const guessesjson = await res.json();
            setGuesses(guessesjson.guesses);
        }

        getBirdToday();
        getUserState();
        getUserGuesses();
    }, []);

    const handleGuess = (resBody: resBodyType) => {
        console.log(resBody.state);
        setUserState(resBody.state)
        if (resBody.state === "ONGOING"){
            setGuesses((prevGuesses) => [...prevGuesses, resBody.bird]);
        }
    }

    useEffect(() => {
        if (cardsRef.current) {
            cardsRef.current.scrollTo({
                left: cardsRef.current.scrollWidth,
                behavior: 'smooth',
            });
        }
    }, [guesses]);

    if(!bird || !userState) {
        return null;
    }

    return userState === "ONGOING" ?
        (
        <div className={classes.wrapper}>
            <motion.div
            className={classes.gameDiv}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            >
                    <div className={classes.bird}>
                        <p className={classes.todaysBird}>Today's Bird</p>
                        <div className={classes.imgAndCredit}>
                            <img src={bird.image_url} alt="" className={classes.birdImg} />
                            <p className={classes.credit}>© {bird.image_credit}</p>
                        </div>
                    </div>
                    <InputBar input={input} setInput={setInput} results={results} setResults={setResults} handleGuess={handleGuess} />
                <div className={classes.cardsDiv} ref={cardsRef}>
                    {
                        guesses.map((guess, index) => (
                            <motion.div
                            className={classes.fadein}
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <GuessCard key={index} guess={guess} answer={bird}/>
                            </motion.div>
                        ))
                    }
                </div>
            </motion.div>
        </div>
    ):(
        <EndingScreen bird={bird} state={userState}/>
    );
}

export default MainPage