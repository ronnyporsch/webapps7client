/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */

import Event from "../m/Event.mjs";
import { handleAuthentication } from "./accessControl.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";

handleAuthentication();

const eventRecords = await Event.retrieveAll();

/***************************************************************
 Declare variables for accessing UI elements
 ***************************************************************/
const formEl = document.forms["Event"],
  deleteButton = formEl["commit"],
  selectEventEl = formEl["selectEvent"];

  fillSelectWithOptions( eventRecords, selectEventEl, "eventID", "name");

  /********************************************************************
   Add further event listeners, especially for the delete/submit button
   ********************************************************************/
  deleteButton.addEventListener("click", function () {
    const eventIdRef = selectEventEl.value;
    if (!eventIdRef) return;
    if (confirm("Do you really want to delete this event record?")) {
      Event.destroy( eventIdRef);
      // remove deleted book from select options
      selectEventEl.remove(selectEventEl.selectedIndex);
    }
  });