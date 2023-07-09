/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */

import Event from "../m/Event.mjs";
import { handleAuthentication } from "./accessControl.mjs";
import { fillSelectWithOptions } from "../../lib/util.mjs";

handleAuthentication();

const eventRecords = await Event.retrieveAll();

const formEl = document.forms["Event"],
    updateButton = formEl["commit"],
    selectEventEl = formEl["selectEvent"];

formEl["eventID"].addEventListener("input", function () {
    // do not yet check the ID constraint, only before commit
    formEl["eventID"].setCustomValidity(Event.checkEventID(formEl["eventID"].value).message);
});
formEl["name"].addEventListener("input", function () {
    formEl["name"].setCustomValidity(Event.checkName(formEl["name"].value).message);
});
formEl["style"].addEventListener("input", function () {
    formEl["style"].setCustomValidity(Event.checkStyle(formEl["style"].value).message);
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
    } else {
        formEl.reset();
    }
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