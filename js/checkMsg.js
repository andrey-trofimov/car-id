import { waitingForReadingNotice, readMessageNotice } from "./systemMessages.js";
import { showError } from "./script.js";

const sectionSendMsg = document.querySelector("#send-msg");
let timeoutId = 0;

checkMsgStatus();

async function checkMsgStatus() {
    const notificationId = localStorage.getItem("notification_id");
    // const notificationId = window.location.pathname.slice(14, window.location.pathname.length - 1);

    const fetchUrl = `https://car-id.ru/api/notification/${notificationId}/status`;

    try {
        let fetchAnswer = await fetch(fetchUrl);
        if (fetchAnswer.ok) {
            let msgStatus = await fetchAnswer.json();

            if (!["UNREAD", "READ"].includes(msgStatus.status)) {
                showError(msgStatus.status);
            }
            if (msgStatus.status === "UNREAD") {
                sectionSendMsg.innerHTML = waitingForReadingNotice;
                timeoutId = setTimeout(() => checkMsgStatus(), 5000);
            }
            if (msgStatus.status === "READ") {
                clearTimeout(timeoutId);
                sectionSendMsg.innerHTML = readMessageNotice;
            }
        } else {
            showError(response.status);
        }
    } catch (err) {
        showError(err);
    }
}
