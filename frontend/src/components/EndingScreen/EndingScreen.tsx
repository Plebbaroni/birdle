import {useState, useEffect, useMemo} from 'react'
import classes from './EndingScreen.module.css';

interface Bird {
  common_name: string;
  scientific_name: string;
  genus: string;
  species: string;
  order: string;
  family: string;
  [key:string]: string|boolean;
}

interface propType {
  bird:Bird;
  state:string;
}

function EndingScreen(props:propType) {
  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1); 
    date.setHours(0, 0, 0, 0); 
    return date.getTime();
  }, []);

  const [timeLeft, setTimeLeft] = useState<number>(targetDate - Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(targetDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  const formatTime = (time: number): string => {
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return(
    <div className={classes.wrapper}>
        <div className={classes.endingSum}>
          <p className={classes.endingMsg}>{props.state === "WON" ? "Congratulations!" : "Better luck next time!"}</p>
          <p className={classes.birdIs}>The bird of the day was</p>
        </div>
        <div className={classes.imgAndCredit}>
          <img src={props.bird.image_url} alt="" className={classes.birdImg} />
          <p className={classes.credit}>© {props.bird.image_credit}</p>
        </div>
        <p className={classes.birdCom}>{props.bird.common_name}</p>
        <p className={classes.birdSci}>{props.bird.scientific_name}</p>
      <p className={classes.countdown}>Try again in {formatTime(timeLeft)}</p>
    </div>
  )
}

export default EndingScreen