/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */

import Event, { StyleEL } from "../m/Event.mjs";
import { handleAuthentication } from "./accessControl.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";

handleAuthentication();

const eventRecords = await Event.retrieveAll();

const formEl = document.forms["Event"],
    updateButton = formEl["commit"],
    selectEventEl = formEl["selectEvent"],
    styleEl = formEL["style"];

let cancelListener = null;
/***************************************************************
 Set up (choice) widgets
 ***************************************************************/
fillSelectWithOptions(eventRecords, selectEventEl, "eventID", "name");

selectEventEl.addEventListener("change", async function () {
    const eventKey = selectEventEl.value;
    if (eventKey) {
        // retrieve up-to-date book record
        const eventRecord = await Event.retrieve(bookKey);
        for (const field of ["eventID", "name", "style", "date", "description", "maxParticipants"]) {
            formEl[field].value = eventRecord[field] !== undefined ? eventRecord[field] : "";
            // delete custom validation error message which may have been set before
            formEl[field].setCustomValidity("");
        }
        if (cancelListener) cancelListener();
        // add listener to selected book, returning the function to cancel listener
        cancelListener = await Event.observeChanges( eventKey);
    } else {
        formEl.reset();
    }
});
fillSelectWithOptions( styleEl, StyleEL.labels);
formEl["name"].addEventListener("input", function () {
    formEl["name"].setCustomValidity(Event.checkName(formEl["name"].value).message);
});
styleEl.addEventListener("change", function () {
    styleEl.setCustomValidity(
      (!styleEl.value) ? "A value must be selected!":"" );
  });
formEl["date"].addEventListener("input", function () {
    formEl["date"].setCustomValidity(Event.checkDate(formEl["date"].value).message);
});
formEl["description"].addEventListener("input", function () {
    formEl["description"].setCustomValidity(Event.checkDescription(formEl["description"].value).message);
});
formEl["maxParticipants"].addEventListener("input", function () {
    formEl["maxParticipants"].setCustomValidity(Event.checkMaxParticipants(formEl["maxParticipants"].value).message);
});
updateButton.addEventListener("click", async function () {
    const formEl = document.forms["Event"],
        selectEventEl = formEl["selectEvent"],
        eventIdRef = selectEventEl.value;
    if (!eventIdRef) return;
    const slots = {
        eventID: formEl["eventID"].value,
        name: formEl["name"].value,
        style: formEl["style"].value,
        date: formEl["date"].value,
        description: formEl["description"].value,
        maxParticipants: formEl["maxParticipants"].value
    };
    formEl["name"].addEventListener("input", function () {
        formEl["name"].setCustomValidity(
            Event.checkName(slots.name).message);
    });
    formEl["style"].addEventListener("input", function () {
        formEl["style"].setCustomValidity(
            Event.checkStyle(slots.style).message);
    });
    formEl["date"].addEventListener("input", function () {
        formEl["date"].setCustomValidity(
            Event.checkDate(slots.date).message);
    });
    formEl["description"].addEventListener("input", function () {
        formEl["description"].setCustomValidity(
            Event.checkDescription(slots.description).message);
    });
    formEl["maxParticipants"].addEventListener("input", function () {
        formEl["maxParticipants"].setCustomValidity(
            Event.checkMaxParticipants(slots.maxParticipants).message);
    });
    if (formEl.checkValidity()) {
        Event.update(slots);
        // update the selection list option
        selectEventEl.options[selectEventEl.selectedIndex].text = slots.name;
        formEl.reset();
    }
});
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
});
// set event to cancel DB listener when the browser window/tab is closed
window.addEventListener("beforeunload", function () {
    if (cancelListener) cancelListener();
  });