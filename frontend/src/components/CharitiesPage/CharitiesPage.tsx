import React from 'react'
import classes from "./CharitiesPage.module.css"
import {motion} from "framer-motion"

function CharitiesPage() {
  return (
    <motion.div
          className={classes.wrapper}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={classes.infoheader}>
              <h1>Donate</h1>
              <p>Our planet’s wildlife is on the brink. Conservation organizations like those below do invaluable work to protect species from extinction and other existential threats.</p>
              <p>Please consider learning more or supporting their efforts by visiting their websites or making a donation.</p>
          </div>
          <div className={classes.charities}>
              <p>fillertext</p>
          </div>
          <div className={classes.footerdiv}>
            <p className={classes.footer}>*No styling yet for the links. I'll need permission to use logos.</p>
            <p className={classes.footer}>If you have any suggestions regarding this page, feel free to email me at jaredlucasschulz@gmail.com</p>
          </div>
    </motion.div>
  )
}

export default CharitiesPage