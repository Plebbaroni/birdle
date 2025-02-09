import classes from "./Navbar.module.css"

export default function Navbar() {
  return (
    <div className={classes.wrapper}>
        <div className={classes.logo}>
            <p>BirdOfTheDay.</p>
        </div>
        <div className={classes.links}>
            <p>?</p>
        </div>
    </div>
  )
}
