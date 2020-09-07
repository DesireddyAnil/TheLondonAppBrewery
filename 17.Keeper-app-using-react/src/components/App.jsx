import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Note from './Note';
//import notes from '../notes';
import CreateArea from './CreateArea';


function App (){
    const [notesArr, setNotesArr] = useState([]);

    function addNote(note){
        setNotesArr(prevValue => {return [...prevValue, note];});
    }

    function deleteNote(id){
        setNotesArr(prevValue => {
            return prevValue.filter((note,index)=>{
                return id!==index;
            });
        });
    }

    return (
        <div>
            <Header/>
            <CreateArea addNote={addNote} index={notesArr.length}/>
            {notesArr.map((note,index) => 
                <Note
                    key = {note.key}
                    id = {index}
                    title = {note.title}
                    content = {note.content}
                    onDelete = {deleteNote}
                />
            )}   
            <Footer/>
        </div>
    );
};

export default App;