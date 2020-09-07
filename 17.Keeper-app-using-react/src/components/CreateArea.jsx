import React, { useState } from "react";

function CreateArea(props) {
    const [note, setNote] = useState({key: props.index, title: "", content: ""});
    
    function handleChange(event){
        const {name, value} = event.target;
        setNote(prevValue => {
            return{
                ...prevValue,
            [name]: value
        }});
    }


  return (
    <div>
      <form onSubmit={event=>event.preventDefault()}>
        <input name="title" onChange={handleChange} placeholder="Title" value={note.title}/>
        <textarea name="content" onChange={handleChange} placeholder="Take a note..." rows="3" value={note.content}/>
        <button onClick={()=>{props.addNote(note); setNote({key: "", title: "", content: ""})}}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
