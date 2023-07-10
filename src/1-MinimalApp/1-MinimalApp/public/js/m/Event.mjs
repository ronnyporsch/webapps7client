/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */
import { fsDb } from "../initFirebase.mjs";
import { collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, setDoc, updateDoc, query as fsQuery, orderBy }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { isNonEmptyString, isIntegerOrIntegerString }
  from "../../lib/util.mjs";
import {
  NoConstraintViolation, MandatoryValueConstraintViolation, RangeConstraintViolation, UniquenessConstraintViolation, IntervalConstraintViolation
}
  from "../../lib/errorTypes.mjs";
import Enumeration from "../../lib/Enumeration.mjs";

/**
 * @constructor
 * @param {{eventID: number, name: string, style: string, date: DateTime, description: string, maxParticipants: number}} slots - Object creation slots.
 * 
 * TODO: change style to enumeration, add participants
 */

const StyleEL = new Enumeration(["Salsa", "Bachata", "Kizomba", "Zouk"]);
class Event {

  constructor({ eventID, name, style, date, description, maxParticipants }) {
    this.eventID = eventID;
    this.name = name;
    this.style = style;
    this.date = date;
    this.description = description;
    this.maxParticipants = maxParticipants;
  }

  get eventID() {
    return this.__eventID;
  };

  set eventID(eventID) {
    const validationResult = Event.checkEventID(eventID);
    if (validationResult instanceof NoConstraintViolation) {
      this.__eventID = eventID;
    } else {
      throw validationResult;
    }
  };

  static checkEventID(eventID) {
    console.log("check id");
    if (!eventID) return new NoConstraintViolation();
    else if (!isIntegerOrIntegerString(eventID) || parseInt(eventID) < 1) {
      return new RangeConstraintViolation("The eventID must be a positive integer!");
    } else {
      return new NoConstraintViolation();
    }
  }

  static async checkEventIDasID(eventID) {
    let validationResult = Event.checkEventID(eventID);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!eventID) {
        validationResult = new MandatoryValueConstraintViolation(
          "A value for the eventID must be provided!");
      } else {
        const eventDocSn = await getDoc(fsDoc(fsDb, "events", eventID));
        if (eventDocSn.exists()) {
          validationResult = new UniquenessConstraintViolation(
            "There is already an event record with this ID!");
        } else {
          validationResult = new NoConstraintViolation();
        }
      }
    }
    return validationResult;
  };

  get name() {
    return this.__name;
  }

  set name(name) {
    const validationResult = Event.checkName(name);
    if (validationResult instanceof NoConstraintViolation) {
      this.__name = name;
    } else {
      throw validationResult;
    }
  }

  static checkName(name) {
    console.log("check name");
    if (!name) return new MandatoryValueConstraintViolation("A name must be provided!");
    else if (!isNonEmptyString(name)) {
      return new RangeConstraintViolation("The name must be a non-empty string!");
    } else {
      return new NoConstraintViolation();
    }
  }

  get style() {
    return this.__style;
  }

  set style(style) {
    const validationResult = Event.checkStyle(style);
    if (validationResult instanceof NoConstraintViolation) {
      this.__style = style;
    } else {
      throw validationResult;
    }
  }

  static checkStyle(style) {
    console.log("check style");
    if (!style) {
      return new MandatoryValueConstraintViolation(
        "A style must be provided!");
    } else if (!isIntegerOrIntegerString( style) ||
        parseInt( style) < 1 || parseInt( style) > StyleEL.MAX) {
      return new RangeConstraintViolation(
        `Invalid value for style: ${style}`);
    } else {
      return new NoConstraintViolation();
    }
  }


  get date() {
    return this.__date;
  }

  set date(date) {
    const validationResult = Event.checkDate(date);
    if (validationResult instanceof NoConstraintViolation) {
      this.__date = date;
    } else {
      throw validationResult;
    }
  }

  static checkDate(date) {
    console.log("check date");
    const LOWER_BOUND_DATE = new Date("1895-12-28");
    var validationResult = null;
    if (!date) {
      validationResult = new MandatoryValueConstraintViolation("A date must be provided!");
    } else if ( !Date.parse(date)) {
      validationResult = new RangeConstraintViolation("The date must be a date in format YYYY-MM-DD!");;
    } else if ((new Date(date) < LOWER_BOUND_DATE)) {
      validationResult = new IntervalConstraintViolation("The date has to be later or equal than 1895-12-28!");
    } else {
      validationResult = new NoConstraintViolation();
    }
    return validationResult;
  }

  get description() {
    return this.__description;
  }

  set description(description) {
    const validationResult = Event.checkDescription(description);
    if (validationResult instanceof NoConstraintViolation) {
      this.__description = description;
    } else {
      throw validationResult;
    }
  }

  static checkDescription(description) {
    console.log("check description");
    if (!description) return new MandatoryValueConstraintViolation("A description must be provided!");
    else if (!isNonEmptyString(description)) {
      return new RangeConstraintViolation("The description must be a non-empty string!");
    } else {
      return new NoConstraintViolation();
    }
  }
  get maxParticipants() {
    return this.__maxParticipants;
  };

  set maxParticipants(maxP) {
    const validationResult = Event.checkMaxParticipants(maxP);
    if (validationResult instanceof NoConstraintViolation) {
      this.__maxParticipants = maxP;
    } else {
      throw validationResult;
    }
  };

  static checkMaxParticipants(maxP) {
    if (!maxP) return new MandatoryValueConstraintViolation("Maximum of participants have to be provided!");
    else if (!isIntegerOrIntegerString(maxP) || parseInt(maxP) < 1) {
      return new RangeConstraintViolation("The eventID must be a positive integer!");
    } else {
      return new NoConstraintViolation();
    }
  };



}


Event.converter = {
  toFirestore: function (event) {
    const data = {
      eventID: parseInt(event.eventID),
      name: event.name,
      style: event.style,
      date: new Date(event.date),
      description: event.description,
      maxParticipants: parseInt(event.maxParticipants),
    };
    return data;
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Event(data);
  }
};

/**

* @param slots: {object}
* @returns {Promise<void>}
*/
Event.add = async function (slots) {

  let event = null;

  try {
    event = new Event(slots);

    let validationResult = await Event.checkEventIDasID(event.eventID);
    if (!validationResult instanceof NoConstraintViolation) throw validationResult;
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
    event = null;
  }
  if (event) {
    try {
      const eventDocRef = fsDoc(fsDb, "events", event.eventID).withConverter(Event.converter);
      await setDoc(eventDocRef, event);
      console.log(`Event record ${slots.eventID} created.`);
    } catch (e) {
      console.error(`${e.constructor.name}: ${e.message} + ${e}`);
    }
  }


};
/**
 * loads an event from firestore
 * 
 * @param eventID 
 * @returns {Promise<*>} eventRecord: {array}
 */

Event.retrieve = async function (eventID) {
  try {
    const eventRec = (await getDoc( fsDoc(fsDb, "events", eventID)
      .withConverter( Event.converter))).data();
    console.log(`Event record "${eventRec.eventID}" retrieved.`);
    return eventRec;
  } catch (e) {
    console.error(`Error retrieving event record: ${e}`);
  }
}

Event.retrieveAll = async function (order) {
  if (!order) order = "eventID";
  const eventsCollRef = fsColl( fsDb, "events"),
    q = fsQuery( eventsCollRef, orderBy( order));
  try {
    const eventRecs = (await getDocs( q.withConverter( Event.converter))).docs.map( d => d.data());
    console.log(`${eventRecs.length} event records retrieved ${order ? "ordered by " + order : ""}`);
    return eventRecs;
  } catch (e) {
    console.error(`Error retrieving event records: ${e}`);
  }
}

Event.update = async function (slots) {
  let noConstraintViolated = true,
    validationResult = null,
    eventBeforeUpdate = null;
  const eventDocRef = fsDoc(fsDb, "events", slots.eventID).withConverter(Event.converter),
    updatedSlots = {};
  try {
    // retrieve up-to-date book record
    const eventDocSn = await getDoc(eventDocRef);
    eventBeforeUpdate = eventDocSn.data();
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }

  try {
    if (eventBeforeUpdate.name !== slots.name) {
      validationResult = Event.checkName(slots.name);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.name = slots.name;
      else throw validationResult;
    }
    if (!eventBeforeUpdate.style.isEqualTo(slots.style) ) {
      validationResult = Event.checkStyle(slots.style);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.style = slots.style;
      else throw validationResult;
    }
    if (eventBeforeUpdate.date !== slots.date) {
      validationResult = Event.checkDate(slots.date);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.date = slots.date;
      else throw validationResult;
    }
    if (eventBeforeUpdate.description !== slots.description) {
      validationResult = Event.checkDescription(slots.description);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.description = slots.description;
      else throw validationResult;
    }
    if (eventBeforeUpdate.maxParticipants !== parseInt(slots.maxParticipants)) {
      validationResult = Event.checkMaxParticipants(slots.maxParticipants);
      if (validationResult instanceof NoConstraintViolation) updatedSlots.maxParticipants = slots.maxParticipants;
      else throw validationResult;
    }
  } catch (e){
    noConstraintViolated = false;
    console.error(`${e.constructor.name}: ${e.message}`);
  }
  if (noConstraintViolated) {
    const updatedProperties = Object.keys(updatedSlots);
    if (updatedProperties.length) {
      await updateDoc(bookDocRef, updatedSlots);
      console.log(`Property(ies) "${updatedProperties.toString()}" modified for event record "${slots.eventID}"`);
    } else {
      console.log(`No property value changed for event record "${slots.eventID}"!`);
    }
  }
}

/**
* @param eventID: {string}
* @returns {Promise<void>}
*/
Event.destroy = async function (eventID) {
  try {
    await deleteDoc(fsDoc(fsDb, "events", eventID));
    console.log(`Event record ${eventID} deleted.`);
  } catch (e) {
    console.error(`Error when deleting event record: ${e}`);
  }
};

/**
 * Create test data
 */
Event.generateTestData = async function () {
  try {
    console.log("Generating test data...");
    const response = await fetch( "../../test-data/events.json");
    const eventRecs = await response.json();
    await Promise.all( eventRecs.map( d => Event.add( d)));
    console.log(`${eventRecs.length} events saved.`);
  } catch (e) {
    console.error(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 * Clear database
 */
Event.clearData = async function () {
  if (confirm("Do you really want to delete all records?")) {

    try {
      console.log("Clearing test data...");
      const eventsCollRef = fsColl( fsDb, "events");
      const eventsQrySn = (await getDocs( eventsCollRef));
      await Promise.all( eventsQrySn.docs.map( d => Event.destroy( d.id)))
      console.log(`${eventsQrySn.docs.length} events deleted.`);
    } catch (e) {
      console.error(`${e.constructor.name}: ${e.message}`);
    }
  }
};


Event.observeChanges = async function (eventID) {
  try {
    // listen document changes, returning a snapshot (snapshot) on every change
    const eventDocRef = fsDoc( fsDb, "events", eventID).withConverter( Event.converter);
    const eventRec = (await getDoc( eventDocRef)).data();
    return onSnapshot( eventDocRef, function (snapshot) {
      // create object with original document data
      const originalData = { itemName: "event", description: `${eventRec.name} (ID: ${eventRec.eventID })`};
      if (!snapshot.data()) { // removed: if snapshot has not data
        originalData.type = "REMOVED";
        createModalFromChange( originalData); // invoke modal window reporting change of original data
      } else if (JSON.stringify( eventRec) !== JSON.stringify( snapshot.data())) {
        originalData.type = "MODIFIED";
        createModalFromChange( originalData); // invoke modal window reporting change of original data
      }
    });
  } catch (e) {
    console.error(`${e.constructor.name} : ${e.message}`);
  }
}

export default Event; 
export {StyleEL};