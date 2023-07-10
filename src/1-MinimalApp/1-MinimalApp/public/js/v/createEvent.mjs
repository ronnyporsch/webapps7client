/**
 * @author Pramit Kumar Bhaduri
 * @author Florian Rühs
 */

import { handleAuthentication } from "./accessControl.mjs";
import Event, { StyleEL } from "../m/Event.mjs";
import { showProgressBar, hideProgressBar, fillSelectWithOptions } from "../../lib/util.mjs";

handleAuthentication();

const formEl = document.forms["Event"],
  createButton = formEl["commit"],
  styleSelEl = formEl["style"],
  progressEl = document.querySelector("progress");


  fillSelectWithOptions(styleSelEl, StyleEL.labels);
  formEl["eventID"].addEventListener("input", function () {
    // do not yet check the ID constraint, only before commit
    formEl["eventID"].setCustomValidity( Event.checkEventID( formEl["eventID"].value).message);
  });
  formEl["name"].addEventListener("input", function () {
    formEl["name"].setCustomValidity( Event.checkName( formEl["name"].value).message);
  });
  formEl["date"].addEventListener("input", function () {
    formEl["date"].setCustomValidity( Event.checkDate( formEl["date"].value).message);
  });
  formEl["description"].addEventListener("input", function () {
    formEl["description"].setCustomValidity( Event.checkDescription( formEl["description"].value).message);
  });
  formEl["maxParticipants"].addEventListener("input", function () {
    formEl["maxParticipants"].setCustomValidity( Event.checkMaxParticipants( formEl["maxParticipants"].value).message);
  });

createButton.addEventListener("click", async function () {
  const slots = {
    eventID: formEl["eventID"].value,
    name: formEl["name"].value,
    style: formEl["style"].value,
    date: formEl["date"].value,
    description: formEl["description"].value,
    maxParticipants: formEl["maxParticipants"].value,
  };
  showProgressBar( progressEl);
  formEl["eventID"].setCustomValidity(( await Event.checkEventIDasID( slots.eventID)).message);
  formEl["name"].setCustomValidity(( Event.checkName( slots.name)).message);
  formEl["style"].setCustomValidity((  Event.checkStyle( slots.style)).message);
  formEl["date"].setCustomValidity((  Event.checkDate( slots.date)).message);
  formEl["description"].setCustomValidity((  Event.checkDescription( slots.description)).message);
  formEl["maxParticipants"].setCustomValidity((  Event.checkMaxParticipants( slots.maxParticipants)).message);

  if (formEl.checkValidity()) {
    await Event.add( slots);
    formEl.reset();
  }
  hideProgressBar( progressEl);
});
// neutralize the submit event
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
});

