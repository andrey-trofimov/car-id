export function msgItem(msg) {
    return `<label class="custom-radio">${msg.title}<input type="radio" name="msg" id=${msg.id} /></label>`;
}
