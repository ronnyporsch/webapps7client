/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */

import Event from "../m/Event.mjs";
import { handleAuthentication } from "./accessControl.mjs";

handleAuthentication();

const eventRecords = await Event.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Event"],
  deleteButton = formEl["commit"],
  selectEventEl = formEl["selectEvent"];

/***************************************************************
 Set up select element
 ***************************************************************/
for (const eventRec of eventRecords) {
  const optionEl = document.createElement("option");
  optionEl.text = eventRec.name;
  optionEl.value = eventRec.eventID;
  selectEventEl.add( optionEl, null);
}

/******************************************************************
 Add event listeners for the delete/submit button
 ******************************************************************/
// set an event handler for the delete button
deleteButton.addEventListener("click", async function () {
  const eventID = selectEventEl.value;
  if (!eventID) return;
  if (confirm("Do you really want to delete this event record?")) {
    await Event.destroy( eventID);
    selectEventEl.remove( selectEventEl.selectedIndex);
  }
});