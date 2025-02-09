import classes from "./MainPage.module.css"
import InputBar from "../InputBar/InputBar"
import GuessCard from "../GuessCard/GuessCard"
import {useEffect, useState} from "react";

function MainPage() {
    const [bird, setBird] = useState(null)
    useEffect(() => {
        const getBirdToday = async () => {
            const res = await fetch(`http://localhost:5181/api/bird-today`);
            const birdjson = await res.json();
            console.log(birdjson);
            setBird(birdjson.bird);
        };
        getBirdToday();
    }, []);

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
                <InputBar />
                <div className={classes.cardsDiv}>
                    <GuessCard guess={bird} answer={bird}/>
                </div>
            </div>
        </div>
    );
}

export default MainPage