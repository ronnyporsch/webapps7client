/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */
import { fsDb } from "../initFirebase.mjs";
import { collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, setDoc, updateDoc }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";


  /**
   * @constructor
   * @param {{eventID: number, name: string, style: string, date: DateTime, description: string, maxParticipants: number}} slots - Object creation slots.
   * 
   * TODO: change style to enumeration, add participants
   */
  class Event {

    constructor({eventID, name, style, date, description, maxParticipants}){
        this.eventID = eventID;
        this.name = name;
        this.style = style;
        this.date = date;
        this.description = description;
        this.maxParticipants = maxParticipants;
    }
  }

  /**
   * loads an event from firestore
   * 
   * @param eventID
   * @returns {Promise<*>} eventRecord: {array}
   */
  Event.retrieve = async function (eventID){
    let eventDocSn = null;
    try {
        const eventDocRef = fsDoc( fsDb, "events", eventID);
        eventDocSn = await getDoc( eventDocRef);
    } catch( e){
        console.error(`Error when retrieving event record: ${e}`);
        return null;
    }
    const eventRec = eventDocSn.data();
    return eventRec;
  }

  Event.retrieveAll = async function (){
    let eventsQrySn = null;
    try {
        const eventCollRef = fsColl( fsDb, "events");
        eventsQrySn = await getDocs( eventCollRef);
    }catch( e){
        console.error(`Error when retrieving event records: ${e}`);
        return null;
    }
    const eventDocs = eventsQrySn.docs,
        eventRecs = eventDocs.map( d => d.data());
    console.log(`${eventRecs.length} event records retrieved.`);
    return eventRecs;
  }

  export default Event;