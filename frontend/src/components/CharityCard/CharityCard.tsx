import classes from "./CharityCard.module.css"

interface propType {
    imagepath: string;
    title: string;
    description: string;
  }

function CharityCard(props:propType) {
  return (
    <div className={classes.wrapper}>
        <img src={props.imagepath} alt="" />
        <div>
            <h1>{props.title}</h1>
            <p>{props.description}</p>
        </div>
    </div>
  )
}

export default CharityCard