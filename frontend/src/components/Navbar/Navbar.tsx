import classes from "./Navbar.module.css"
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className={classes.wrapper}>
        <div className={classes.logo}>
            <Link to="/" className={classes.link}><p>BirdOfTheDay.</p></Link>
        </div>
        <div className={classes.links}>
          <Link to="/charities" className={classes.link}><p>Charities</p></Link>
          <Link to="/howtoplay" className={classes.link}><p>How To Play</p></Link>
        </div>
    </div>
  )
}
