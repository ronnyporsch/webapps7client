/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */
import { fsDb } from "../initFirebase.mjs";
import { collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, setDoc, updateDoc }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";


  /**
   * @constructor
   * @param {{name: string, style: string, date: DateTime, description: string, maxParticipants: number}} slots - Object creation slots.
   * 
   * TODO: change style to enumeration, add participants
   */
  class Event {

    constructor({name, style, date, description, maxParticipants}){
        this.name = name;
        this.style = style;
        this.date = date;
        this.description = description;
        this.maxParticipants = maxParticipants;
    }
  }
