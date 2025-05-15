import React from 'react'
import classes from "./CharitiesPage.module.css"

function CharitiesPage() {
  return (
    <div className={classes.wrapper}>
        <div className={classes.infoheader}>
            <h1>Donate</h1>
            <p>Our planet's wildlife is on the brink. A donation may be able to help them. Consider donating to conservation societies below!</p>
        </div>
        <div className={classes.charities}>

        </div>
    </div>
  )
}

export default CharitiesPage