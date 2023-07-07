/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */
import { fsDb } from "../initFirebase.mjs";
import { collection as fsColl, deleteDoc, doc as fsDoc, getDoc, getDocs, setDoc, updateDoc }
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { isNonEmptyString, isIntegerOrIntegerString }
  from "../../lib/util.mjs";
import {
  NoConstraintViolation, MandatoryValueConstraintViolation, RangeConstraintViolation, UniquenessConstraintViolation
}
  from "../../lib/errorTypes.mjs";


/**
 * @constructor
 * @param {{eventID: number, name: string, style: string, date: DateTime, description: string, maxParticipants: number}} slots - Object creation slots.
 * 
 * TODO: change style to enumeration, add participants
 */

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
    /*
    * TODO: checkStyle
    */
    return NoConstraintViolation;
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

  static checkDate(date){
    /*
    * TODO: implement correct date validation
    */
    if (!date) return new MandatoryValueConstraintViolation("A date must be provided!");
    else if (!isNonEmptyString(date)) {
      return new RangeConstraintViolation("The date must be a non-empty string!");
    } else {
      return new NoConstraintViolation();
    }
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

/**

* @param slots: {object}
* @returns {Promise<void>}
*/
Event.add = async function (slots) {

  const eventsCollRef = fsColl(fsDb, "events"),
    eventDocRef = fsDoc(eventsCollRef, slots.eventID);
  slots.maxParticipants = parseInt(slots.maxParticipants);
  try {
    await setDoc(eventDocRef, slots);
    console.log(`Event record ${slots.eventID} created.`);
  } catch (e) {
    console.error(`Error when adding event record: ${e}`);
  }
};
/**
 * loads an event from firestore
 * 
 * @param eventID 
 * @returns {Promise<*>} eventRecord: {array}
 */

Event.retrieve = async function (eventID) {
  let eventDocSn = null;
  try {
    const eventDocRef = fsDoc(fsDb, "events", eventID);
    eventDocSn = await getDoc(eventDocRef);
  } catch (e) {
    console.error(`Error when retrieving event record: ${e}`);
    return null;
  }
  const eventRec = eventDocSn.data();
  return eventRec;
}

Event.retrieveAll = async function () {
  let eventsQrySn = null;
  try {
    const eventCollRef = fsColl(fsDb, "events");
    eventsQrySn = await getDocs(eventCollRef);
  } catch (e) {
    console.error(`Error when retrieving event records: ${e}`);
    return null;
  }
  const eventDocs = eventsQrySn.docs,
    eventRecs = eventDocs.map(d => d.data());
  console.log(`${eventRecs.length} event records retrieved.`);
  return eventRecs;
}

Event.update = async function (slots) {
  const updSlots = {};

  const eventRec = await Event.retrieve(slots.eventID);
  // convert from string to integer
  if (slots.maxParticipants) slots.maxParticipants = parseInt(slots.maxParticipants);
  // update only those slots that have changed
  if (eventRec.name !== slots.name) updSlots.name = slots.name;
  if (eventRec.style !== slots.style) updSlots.style = slots.style;
  if (eventRec.date !== slots.date) updSlots.date = slots.date;
  if (eventRec.description !== slots.description) updSlots.description = slots.description;
  if (eventRec.maxParticipants !== slots.maxParticipants) updSlots.maxParticipants = slots.maxParticipants;
  if (Object.keys(updSlots).length > 0) {
    try {
      const eventDocRef = fsDoc(fsDb, "events", slots.eventID);
      await updateDoc(eventDocRef, updSlots);
      console.log(`Event record ${slots.eventID} modified.`);
    } catch (e) {
      console.error(`Error when updating event record: ${e}`);
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
  let eventRecs = [
    {
      eventID: "1",
      name: "Salsa Saturdays",
      style: "Salsa",
      date: "2023-06-01",
      description: "A fun couple-salsa session.",
      maxParticipants: 20,
    },
    {
      eventID: "2",
      name: "Bachata with bachelors",
      style: "Bachata",
      date: "2023-06-10",
      description: "A introductory lesson to bachelors for Bachata.",
      maxParticipants: 16,
    },
  ];

  await Promise.all(eventRecs.map(d => Event.add(d)));
  console.log(`${Object.keys(eventRecs).length} event records saved.`);
};
/**
 * Clear database
 */
Event.clearData = async function () {
  if (confirm("Do you really want to delete all records?")) {

    const eventRecs = await Event.retrieveAll();
    // delete all documents
    await Promise.all(eventRecs.map(d => Event.destroy(d.eventID)));
    // ... and then report that they have been deleted
    console.log(`${Object.values(eventRecs).length} records deleted.`);
  }
};


export default Event;