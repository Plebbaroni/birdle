import React from 'react'
import classes from "./CharitiesPage.module.css"
import {motion} from "framer-motion"

function CharitiesPage() {
  return (
    <div className={classes.wrapper}>
       <motion.div
          className={classes.fadein}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={classes.infoheader}>
              <h1>Donate</h1>
              <p>Our planet's wildlife is on the brink. A donation may be able to help them. Consider donating to conservation societies below!</p>
          </div>
          <div className={classes.charities}>
              
          </div>
        </motion.div>
    </div>
  )
}

export default CharitiesPage