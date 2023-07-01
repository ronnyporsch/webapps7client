import { auth } from "../initialize.mjs";
import { onAuthStateChanged, signInAnonymously, signOut } from "https://www.gstatic.com/firebasejs/9.X.X/firebase-auth.js";


function handleAuthentication() {
    // get current page value
    const currentPage = window.location.pathname;
    try {
      // evaluate user authentication status
      onAuthStateChanged( auth, async function (user) {
        // if status is "anonymous" or "registered"
        if (user) {
          if (user.isAnonymous) { // if user is "anonymous"
            handleAuthorization( "Anonymous", currentPage);
          } else { // if status is "registered"
            if (!user.emailVerified) { // if email address is not verified
              handleAuthorization( "Registered with non-verified email", currentPage, user.email);
            } else { // if email address is verified
              handleAuthorization( "Registered with verified email", currentPage, user.email);
            }
          }
        }
        else signInAnonymously( auth); // otherwise, upgrade to "anonymous"
      });
    } catch (e) {
      console.error(`Error with user authentication: ${e}`);
    }
  }

  function handleAuthorization( userStatus, currentPage, email) {

    // declare variables for current page and for accessing UI elements
    const divLoginMgmtEl = document.getElementById("login-management"),
    startPage = ["/","/index.html"],
    authorizedPages = startPage.concat(["/retrieveAndListAllEvents.html", "/credits.html"]);
    switch (userStatus) {
      case "Anonymous":
        // if user is not authorized to current page, restrict access & redirect to sign up page
        if (!authorizedPages.includes( currentPage)) window.location.pathname = "/signUp.html";
        else divLoginMgmtEl.appendChild( createSignInAndSignUpUI());
        console.log(`Authenticated as "${userStatus}"`);
        break;
      case "Registered with non-verified email":
        // if user is not authorized to current page, restrict access & redirect to start page
        if (!authorizedPages.includes( currentPage)) window.location.pathname = "/index.html";
        else divLoginMgmtEl.appendChild( createSignOutUI( email, true));
        console.log(`Authenticated as "${userStatus}" (${email})`);
        break;
      case "Registered with verified email":
        // if current page is start page grant access to the four database operations
        if (startPage.includes( currentPage)) {
            // declare variables for accessing UI elements
            const clearDataBtn = document.getElementById("clearData"),
            generateDataBtns = document.querySelectorAll(".generateTestData"),
            disabledEls = document.querySelectorAll(".disabled");
            // perform DOM operations to enable menu items
            for (const el of disabledEls) el.classList.remove("disabled");
            clearDataBtn.disabled = false;
            for (const btn of generateDataBtns) btn.disabled = false;
        }
        divLoginMgmtEl.appendChild( createSignOutUI( email));
        console.log(`Authenticated as "${userStatus}" (${email})`);
        break;

    }
  }