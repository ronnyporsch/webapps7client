
import { auth } from "../initFirebase.mjs";
import { applyActionCode, confirmPasswordReset, signInWithEmailAndPassword,
  verifyPasswordResetCode}
  from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";


const mode = getParameterByName("mode");
// get the one-time code from the query parameter
const actionCode = getParameterByName("oobCode");
const [sectionVeriEmailEl, sectionRstPswEl]
  = document.querySelectorAll("main>div>section");


switch (mode) {
  case "verifyEmail":
    // display email verification handler and UI
    sectionVeriEmailEl.hidden = false;
    await handleVerifyEmail( sectionVeriEmailEl, actionCode);
    break;
  case "resetPassword":
    // display reset password handler and UI
    sectionRstPswEl.hidden = false;
    await handleResetPassword( sectionRstPswEl, actionCode);
    break;
}

async function handleVerifyEmail( sectionVeriEmailEl, actionCode) {
  const h1El = document.querySelector("h1"),
    pEl = sectionVeriEmailEl.querySelector("p");
  let email = null;
  try {
    // first verify if action code is still valid
    email = await verifyPasswordResetCode( auth, actionCode);
    // ...and then we apply the action code to verify email
    await applyActionCode( auth, actionCode);
    h1El.textContent = "Your email address has been verified";
    const bEl = document.createElement("b");
    bEl.textContent = email;
    pEl.innerText = "Now this account is authorized to use any data management operation: ";
    pEl.appendChild( bEl);
  } catch (e) {
    h1El.textContent = "Invalid or expired link.";
    pEl.textContent = "Your email address has not been verified.";
    const divMsgEl = document.getElementById("message");
    divMsgEl.textContent = e.message;
    divMsgEl.hidden = false;
  }
}

async function handleResetPassword( sectionRstPswEl, actionCode) {
  const h1El = document.querySelector("h1"),
    pEl = sectionRstPswEl.querySelector("p"),
    formEl = document.forms["Password"];
  try {
    // first verify if action code is still valid
    const email = await verifyPasswordResetCode( auth, actionCode);
    h1El.textContent = "Reset password";
    const bEl = document.createElement("b");
    bEl.textContent = email;
    pEl.innerText = "For: ";
    pEl.appendChild( bEl);
    const saveButton = formEl["commit"];
    saveButton.addEventListener("click", async function () {
      // get new password from form
      const newPassword = formEl["password"].value;
      if (newPassword) {
        // ...and then we apply the action code to reset password
        await confirmPasswordReset( auth, actionCode, newPassword);
        alert(`Your password has been update! You will be automatically signed in with your email address "${email}.`);
        // sign in user using email + password
        await signInWithEmailAndPassword( auth, email, newPassword);
        window.location.pathname = "/index.html"; // redirect user to start page
      }
    });
  } catch (e) {
    formEl.hidden = true;
    h1El.textContent = "Invalid or expired link.";
    pEl.textContent = "Your password cannot be reset.";
    const divMsgEl = document.getElementById("message");
    divMsgEl.textContent = e.message;
    divMsgEl.hidden = false;
  }
}

function getParameterByName( parameter) {
  const urlParams = new URLSearchParams( location.search);
  return urlParams.get( parameter);
}