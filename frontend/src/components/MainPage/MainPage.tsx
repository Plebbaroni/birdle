import classes from "./MainPage.module.css"

function MainPage() {
    const bird = {
        imageurl: "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/305292761/2400",
        credit: "Luke Seitz"
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
               <div className={classes.cardsDiv}>

               </div>
            </div>
        </div>
    )
}

export default MainPage