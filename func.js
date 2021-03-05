
var firebaseConfig = {
    apiKey: "AIzaSyBjqb5ABCsrgwBUcOoI9RIOUMKw47ZPdo4",
    authDomain: "lambda-387b3.firebaseapp.com",
    projectId: "lambda-387b3",
    storageBucket: "lambda-387b3.appspot.com",
    messagingSenderId: "742560784948",
    appId: "1:742560784948:web:0477fae7093b56d753a061",
    measurementId: "G-VZ3K6T3PG4"
};
firebase.initializeApp(firebaseConfig);




var chatboxCurrentFlash = "";
var chatMode = false;

document.getElementById('loadline').style.visibility = 'hidden';
var consoleArea = document.getElementById('console');
consoleArea.value = "LAMBDA OSv1.12.47584"

$("input").keyup(function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 13) {
        var command = document.getElementById('commandLine').value;
        document.getElementById('commandLine').value = "";
        if (!chatMode) {
            evaluateCommand(command);
        } else {
            if (command.toUpperCase() == "-EXIT") {
                chatMode = false;
                consoleArea.value = chatboxCurrentFlash;
                com("Exiting direct query mode.");
                consoleArea.scrollTop = consoleArea.scrollHeight;
            } else {
                chat(command);
            }
        }

    }
});

async function evaluateCommand(command) {
    document.getElementById('loadline').style.visibility = 'visible';
    consoleArea.value = consoleArea.value + "\n[USER] : " + command;
    await new Promise(r => setTimeout(r, 200));
    var args = command.split(" ");
    switch (args[0].toUpperCase()) {
        case "HELP":
            com("All available commands:")
            com("\tCHAT - Open direct query line with LAMBDA (BETA).");
            com("\tCLEAR - Clears consoleArea screen.");
            com("\tDECRYPT [Library] - Displays decoded information on specified library. For list of libraries, use 'DECRYPT -libs'");
            com("\tVERSION - Displays information about current system.");
            break;
        case "CHAT":
            com("Entering direct query mode. (BETA)");
            await new Promise(r => setTimeout(r, 300));
            chatboxCurrentFlash = consoleArea.value;
            chatMode = true;
            updateChat();
            break;
        case "VERSION":
            com("");
            com("LAMBDA OSv1.12.47584");
            com("LAMBDA is currently bound to service for STCTF Generation Caduceus, and operates out of the mainframe system at Terra Base UNNAMED.\n\nAbout: LAMBDA is a self-learning, autonomous Founder subsystem capable of reprogramming itself and improving as the team evolves. At it's infancy, LAMBDA is only capable of some basic tasks including basic language synthesis and information parsing/decoding. Despite this, LAMBDA is fully capable of operating and managing the STCTF base during the absence of operators.\n");
            break;
        case "CLEAR":
            consoleArea.value = "Console Cleared";
            break;
        case "DECRYPT":
            if (args.length == 1) {
                com("Expected usage: DECRYPT [LIBRARY NAME] [optional parameters]. For list of available libraries, use 'DECRYPT -libs'")
                document.getElementById('loadline').style.visibility = 'hidden';
                break;
            }
            decrypt(args);
            break;
        default:
            com("'" + command + "'" + " is not a valid command. Use 'help' to find list of commands.");
    }
    consoleArea.scrollTop = consoleArea.scrollHeight;
    if (args[0].toUpperCase() != "DECRYPT") {
        document.getElementById('loadline').style.visibility = 'hidden';
    }

}

function com(text) {
    consoleArea.value = consoleArea.value + "\n" + text;
}


async function decrypt(args) {
    document.getElementById('loadline').style.visibility = 'visible';
    switch (args[1].toUpperCase()) {
        case "SUBUNIT":
            if (args.length == 2) {
                com("Please specify subunit.");
                document.getElementById('loadline').style.visibility = 'hidden';
                break;
            }
            break;
        case "UNITINFO":
            if (args.length == 2) {
                com("Unit not found, please specify either CURRENT or LAST.");
                document.getElementById('loadline').style.visibility = 'hidden';
                break;
            }
            if (args[2].toUpperCase() == "CURRENT") {
                com("DECRYPTING.")
                consoleArea.scrollTop = consoleArea.scrollHeight;
                await new Promise(r => setTimeout(r, 2000));
                com("Information on current STCTF unit:")
                com("");
                com("UNIT_NAME: STCTF");
                com("UNIT_GENERATION: Caduceus [☤]");
                com("UNIT_HQ: UNNAMED Terrestrial Base");
                com("STATUS: Active");
                com("");
                com("SUB_UNITS:");
                com("\tSCF:");
                com("\t\tSTATUS: Inactive");
                com("\t\tMEMBERS: 12");
                com("\t0x53_0x54 'Star Team':");
                com("\t\tSTATUS: Inactive");
                com("\t\tMEMBERS: 6");
                com("");
            } else if (args[2].toUpperCase() == "LAST") {
                com("DECRYPTING.")
                consoleArea.scrollTop = consoleArea.scrollHeight;
                await new Promise(r => setTimeout(r, 2000));
                com("Annexed information from former STCTF unit:");
                com("");
                com("UNIT_NAME: STCTF");
                com("UNIT_GENERATION: Chiron [⚷]");
                com("UNIT_HQ: STADIUS Lunar Base");
                com("STATUS: Liminal");
                com("");
                com("DATA_RECOVERED_FROM: 'MOONBASE STADIUS' Records Pod");
                com("DATA_RECOVERER_SYS: Space Warp Suit Mk.1 - OSv3.45.12635 [SUPERUSER/Bradnailer]");
                com("");
                com("SUB_UNITS:");
                com("\tBT:");
                com("\t\tSTATUS: Deceased (Indefinite Epochogenic Comatose)");
                com("\t\tMEMBERS: 4");
                com("");
            } else {
                com("Unit not found, please specify either CURRENT or LAST.");
            }
            break;
        case "-LIBS":
            com("Available libraries:");
            com("UNITINFO [CURRENT/LAST]");
            //com("SUBUNIT [unit name]");
            break;
        default:
            com("Unknown library.");
    }
    consoleArea.scrollTop = consoleArea.scrollHeight;
    document.getElementById('loadline').style.visibility = 'hidden';
}

function chat(command) {
    var newData = {
        sender: "user",
        text: command
    }
    firebase.database().ref("messages").push(newData);
}

firebase.database().ref('messages').endAt().limitToLast(20).on('child_added', function (snapshot) {
    if (chatMode) {
        if (snapshot.val().sender == "user") {
            com("[USER] : " + snapshot.val().text);
        } else {
            com("[λ] : " + snapshot.val().text);
        }
    }
    consoleArea.scrollTop = consoleArea.scrollHeight;
});

function updateChat() {
    firebase.database().ref('messages').limitToLast(50).once('value', snapshot => {
        consoleArea.value = "";
        snapshot.forEach(child => {
            if (child.val().sender == "user") {
                com("[USER] : " + child.val().text);
            } else {
                com("[λ] : " + child.val().text);
            }
        })
        com("\nLAMBDA Direct Queries (use '-EXIT' to leave)");
        consoleArea.scrollTop = consoleArea.scrollHeight;
    });

}