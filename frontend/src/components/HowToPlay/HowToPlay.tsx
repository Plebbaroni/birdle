import classes from "./HowToPlay.module.css"
import {motion} from "framer-motion"

function HowToPlay() {
  return (
    <div className={classes.wrapper}>
        <motion.div
          className={classes.content}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <h1 className={classes.headertext}>How To Play</h1>
            <img className={classes.sampleImg} src="assets/Sample.png" alt="" />
            <p className={classes.instructions}>Enter the bird's name on the search bar and a card will spawn, with identifying categories showing as green for correct guesses and red for wrong guesses. You have 6 opportunities to guess the bird every 24 hours!</p>
        </motion.div>
    </div>
  )
}

export default HowToPlay