const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const setchannel = urlParams.get('channel');
const showEvents = urlParams.has('events');
const fontSize = urlParams.get('font');

const styleSheet = document.querySelector('body');
const selectedFontSize = fontSize + 'px';
styleSheet.style.fontSize = selectedFontSize;

let options = {
    options: {
        debug: true,
    },
    connection: {
        secure: true,
        reconnect: true
    },
    channels: [setchannel]
};

let client = new tmi.client(options);

client.connect();

client.log.setLevel('warn');
client.on('join', (channel, username, self) => {
    if(self) {
        client.log.warn(`Joined ${channel}`);
    }
});
console.log("Show Events: ", showEvents);
console.log("Font Size: ", selectedFontSize);

client.on('message', (channel, tags, message, self) => {
    let name = tags['display-name'];
    if (self) return;

    function strip(message){
        let doc = new DOMParser().parseFromString(message, 'text/html');
        return doc.body.textContent || "";
    }

    message = strip(message);

    emoteSize = '3.0';
    function ttvEmoteParser(msg, emotes) {
        let splittedMsg = msg.split('');
        for (let emote in emotes) {
            let emoteLocation = emotes[emote];
            let parsedEmote = '<img class="emote" src="http://static-cdn.jtvnw.net/emoticons/v2/' + emote + '/default/dark/' + emoteSize + '">';
            for (let u in emoteLocation) {
                let x = emoteLocation[u];
                let y = x.split('-');
                let firstLoc = parseInt(y[0]);
                let secLoc = parseInt(y[1]);
                let length = parseInt(secLoc - firstLoc);
                let replaceEmpty = ' ';

                for (let i = 0; i < length + 1; i++) {
                    splittedMsg.splice(firstLoc + i, 1, replaceEmpty);
                }
                splittedMsg.splice(firstLoc + length, 1, parsedEmote);
            }

        }
        return splittedMsg;
    }
    message = ttvEmoteParser(message, tags.emotes);
    message = message.join('');
    message = message.replace(/  +/g, ' ');
    message = message.trim();
    let node = document.createElement('div');
    node.classList.add('chat-message')
    if (tags["msg-id"] === 'highlighted-message') {
        node.classList.add('highlight');
    }
    node.innerHTML = `<span class="name">${name} : </span><span class="message">${message}</span>`;
    document.getElementById("chatbox").appendChild(node);

});

if (showEvents === true) {
    client.on("subscription", (channel, username, method, message, userstate) => {
        console.log("Sub: ", userstate["system-msg"]);
        let message1 = userstate["system-msg"];
        let node = document.createElement('div');
        node.classList.add('chat-message','event');
        node.innerHTML = `<span class="message">${message1}</span>`;
        document.getElementById("chatbox").appendChild(node);
    });

    client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
        console.log("Sub Mystery Gift: ", userstate["system-msg"]);
        let message2 = userstate["system-msg"];
        let node = document.createElement('div');
        node.classList.add('chat-message','event');
        node.innerHTML = `<span class="message">${message2}</span>`;
        document.getElementById("chatbox").appendChild(node);
    });

    client.on("resub", (channel, username, months, message, userstate, methods) => {
        console.log("Resub: ", userstate["system-msg"]);
        let message3 = userstate["system-msg"];
        let node = document.createElement('div');
        node.classList.add('chat-message','event');
        node.innerHTML = `<span class="message">${message3}</span>`;
        document.getElementById("chatbox").appendChild(node);
    });

    client.on("anongiftpaidupgrade", (channel, username, userstate) => {
        console.log("Anon Gift Paid Upgrade: ", userstate["system-msg"]);
        let message4 = userstate["system-msg"];
        let node = document.createElement('div');
        node.classList.add('chat-message','event');
        node.innerHTML = `<span class="message">${message4}</span>`;
        document.getElementById("chatbox").appendChild(node);
    });

    client.on("cheer", (channel, userstate, message) => {
        console.log(userstate);
        console.log("Cheer: ", userstate["system-msg"]);
        let cheerAmount = userstate["bits"];
        let node = document.createElement('div');
        node.classList.add('chat-message','event');
        node.innerHTML = `<span class="message">${message}</span>`;
        document.getElementById("chatbox").appendChild(node);
    });

    client.on("hosted", (channel, username, viewers, autohost) => {
        console.log("Hosted: ", channel, username, viewers, autohost);
        let message6 = userstate["system-msg"];
        let node = document.createElement('div');
        node.classList.add('chat-message','event');
        node.innerHTML = `<span class="message">${message6}</span>`;
        document.getElementById("chatbox").appendChild(node);
    });

    client.on("raided", (channel, username, viewers) => {
        console.log("Raid: ", channel, username, viewers);
        let node = document.createElement('div');
        node.classList.add('chat-message','event');
        node.innerHTML = `<span class="message">${message7}</span>`;
        document.getElementById("chatbox").appendChild(node);
    });

    client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
        console.log("Subgift: ", userstate["system-msg"]);
        let item = userstate["system-msg"];
        let node = document.createElement('div');
        node.classList.add('chat-message','event');
        node.innerHTML = `<span class="message">${item}</span>`;
        document.getElementById("chatbox").appendChild(node);
    });
}
