import classes from './GuessCard.module.css'

interface Bird {
    common_name: string;
    scientific_name: string;
    genus: string;
    species: string;
    order: string;
    family: string;
    [key:string]: string|boolean;
}

interface GuessProps{
    guess:Bird;
    answer: Bird;
}

function GuessCard(props:GuessProps) {
    const birdOfTheDay = props.answer

    const guess = props.guess

  return (
    <div className={classes.wrapper}>
        <div className={classes.name}>
            <p>{guess.common_name}</p>
            <p>{guess.scientific_name}</p>
        </div>
        <div className={classes.categories}>
            <div className={classes.category} style={{ background: (guess.order == birdOfTheDay.order)? "hsl(156, 100%, 19%)" : "hsl(6, 100%, 32%)"}}>
                <p className={classes.catHeader}>Order</p>
                <p className={classes.catGuess}>{guess.order}</p>
            </div>
            <div className={classes.category} style={{ background: (guess.family == birdOfTheDay.family)? "hsl(156, 100%, 19%)" : "hsl(6, 100%, 32%)"}}>
                <p className={classes.catHeader}>Family</p>
                <p className={classes.catGuess}>{guess.family}</p>
            </div>
            <div className={classes.category} style={{ background: (guess.genus == birdOfTheDay.genus)? "hsl(156, 100%, 19%)" : "hsl(6, 100%, 32%)"}}>
                <p className={classes.catHeader}>Genus</p>
                <p className={classes.catGuess}>{guess.genus}</p>
            </div>
            <div className={classes.category} style={{ background: (guess.species == birdOfTheDay.species)? "hsl(156, 100%, 19%)" : "hsl(6, 100%, 32%)"}}>
                <p className={classes.catHeader}>Species</p>
                <p className={classes.catGuess}>{guess.species}</p>
            </div>
        </div>
    </div>
  )
}

export default GuessCard