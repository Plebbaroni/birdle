import classes from './GuessCard.module.css'

function GuessCard() {
    const birdOfTheDay = {
        common_name: "Great Horned Owl",
        scientific_name: "Bubo virginianus",
        genus: "Bubo",
        species: "virginianus",
        order: "Strigiformes",
        family: "Strigidae"
    }

    const guess = {
        common_name: "Snowy Owl",
        scientific_name: "Bubo scandiacus",
        genus: "Bubo",
        species: "scandiacus",
        order: "Strigiformes",
        family: "Strigidae"
    }

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