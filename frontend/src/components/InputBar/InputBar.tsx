import classes from "./InputBar.module.css"

function InputBar() {
  return (
    <div className={classes.wrapper}>
        <div className={classes.inputBar}>
            <input type="text" name="" id="" className={classes.inputText} placeholder="Enter Your Guess Here"/>
        </div>
    </div>
  )
}

export default InputBar