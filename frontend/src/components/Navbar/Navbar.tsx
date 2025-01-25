import classes from "./Navbar.module.css"

export default function Navbar() {
  return (
    <div className={classes.wrapper}>
        <div className={classes.logo}>
            BirdOfTheDay
        </div>
        <div className="Links">
            <p>Donate</p>
            <p>?</p>
        </div>
    </div>
  )
}
