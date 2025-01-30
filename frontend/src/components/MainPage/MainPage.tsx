import classes from "./MainPage.module.css"
import InputBar from "../InputBar/InputBar"
import GuessCard from "../GuessCard/GuessCard"

function MainPage() {
    const bird = {
        imageurl: "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/297363481/2400",
        credit: "Mary Rumple"
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.gameDiv}>
                <div className={classes.bird}>
                    <p className={classes.todaysBird}>Today's Bird</p>
                    <div className={classes.imgAndCredit}>
                        <img src={bird.imageurl} alt="" className={classes.birdImg}/>
                        <p className={classes.credit}>© {bird.credit}</p>
                    </div>
                </div>
                <InputBar/>
               <div className={classes.cardsDiv}>
                    <GuessCard/>
               </div>
            </div>
        </div>
    )
}

export default MainPage