
// ========================================
// ROSEDEL — DIALOGUE
// Journey messages, flower descriptions and conversations.
// ========================================


// JOURNEY MESSAGE CATEGORIES

const journeyCategories = {
  thought: "Thought",
  flower: "Flower",
  environment: "Observation",
  narration: "Journey"
};


// JOURNEY MESSAGE ELEMENTS

const journeyMessage = document.getElementById("journey-message");

let journeyQueue = [];
let currentJourneyMessage = null;
let journeyTimer = 0;
let journeyTypewriterIndex = 0;
let journeyHideTimer = null;


// SHOW A JOURNEY MESSAGE

function showJourneyMessage({
  category = "narration",
  title = "",
  text = "",
  duration = 4,
  typewriter = false
} = {}) {
  if (!journeyMessage) return;

  clearTimeout(journeyHideTimer);

  currentJourneyMessage = {
    category,
    title,
    text,
    duration,
    typewriter
  };

  journeyTimer = duration;
  journeyTypewriterIndex = typewriter ? 0 : text.length;

  journeyMessage.dataset.category = category;
  journeyMessage.classList.remove("hidden");

  const titleElement = journeyMessage.querySelector(".message-title");
  const textElement = journeyMessage.querySelector(".message-text");

  if (titleElement) {
    titleElement.textContent = title;
  }

  if (textElement) {
    textElement.textContent = typewriter ? "" : text;
  }

  journeyMessage.classList.add("visible");
}


// QUEUE JOURNEY MESSAGES

function queueJourneyMessage(message) {
  journeyQueue.push(message);

  if (!currentJourneyMessage && !isConversationActive()) {
    showNextJourneyMessage();
  }
}


function showNextJourneyMessage() {
  if (
    currentJourneyMessage ||
    journeyQueue.length === 0 ||
    isConversationActive()
  ) {
    return;
  }

  showJourneyMessage(journeyQueue.shift());
}


// HIDE JOURNEY MESSAGE

function hideJourneyMessage() {
  if (!journeyMessage) return;

  journeyMessage.classList.remove("visible");

  journeyHideTimer = setTimeout(() => {
    journeyMessage.classList.add("hidden");
  }, 350);

  currentJourneyMessage = null;
  journeyTimer = 0;
}


// ========================================
// FLOWER MESSAGE HELPER
// ========================================

function showFlowerMessage(name, meaning, history) {
  queueJourneyMessage({
    category: "flower",
    title: name,
    text: meaning + "\n\n" + history,
    duration: 6,
    typewriter: true
  });
}


// ========================================
// FINAL CONVERSATION
// ========================================

const conversations = {
  birthdayMeeting: [
    {
      speaker: "The one waiting",
      text: "Finally you're here! took you long enough, didn't it?"
    },
    {
      speaker: "Upcoming",
      text: "I-its just that- I- I h-had a few complications on my way here, im so sorry.."
    },
    {
      speaker: "The one waiting",
      text: "Oh like i'll buy tha- hey, those.. flowers, who are they for?"
    },
    {
      speaker: "Holy fumble",
      text: "O-oh u-uhm these?? uhh.. T-they're- THEY'RE ALL FOR YOU! THEYRE- o-oh my god im so-"
    },
    {
      speaker: "The one waiting",
      text: "Oh. my. GOD."
    },
    {
      speaker: "Lock in bruh",
      text: "I-Im sorry if they're not enough or- uhm-",
     },
    {
     speaker: " Soulmate ",
    text: " You got them from the park, didnt ya?"
    },
    {
     speaker: "dumbass",
     text: " .. "
    },
    {
      speaker: "absolute buffoon",
      text: "Yeah.. "
    },
    {
      speaker: "soulmate",
      text: " hm. "
    },
    {
      speaker: "soulmate",
      text: " y'know.. "
    },
    {
      speaker: "soulmate",
      text: " I wouldnt even mind if you never came with anything, your presence here today was the best thing."
    },
    {
      speaker: "ou shi",
     text: "wha-"
    },
    {
      speaker: " hell yeah ",
      text: "really??"
    },
    {
    speaker: "Soulmate",
    text: " Of course, and that even applies to the person.."
    },
    {
      speaker: "Soulmate",
      text: " The person playing this game, right now."
      
    },
    {
     speaker: " huh ?",
     text: " huh ?"
    }
  ]
};


const conversationBox = document.getElementById("conversation-box");
const conversationSpeaker = document.getElementById("conversation-speaker");
const conversationText = document.getElementById("conversation-text");
const dialogueButton = document.getElementById("dialogue-button");

let conversationActive = false;
let currentConversation = [];
let conversationIndex = 0;
let conversationTyping = false;
let conversationTypewriterIndex = 0;

const CONVERSATION_TYPEWRITER_SPEED = 0.035;
let conversationTypewriterTimer = 0;


// START A CONVERSATION

function startConversation(id) {
  const selectedConversation = conversations[id];

  if (!selectedConversation || !conversationBox) return;

  journeyQueue = [];
  hideJourneyMessage();

  currentConversation = selectedConversation;
  conversationIndex = 0;
  conversationActive = true;

  conversationBox.classList.remove("hidden");

  displayConversationLine();
}


// DISPLAY CURRENT LINE

function displayConversationLine() {
  const line = currentConversation[conversationIndex];

  if (!line) {
    finishConversation();
    return;
  }

  conversationSpeaker.textContent = line.speaker;
  conversationText.textContent = "";

  conversationTypewriterIndex = 0;
  conversationTypewriterTimer = 0;
  conversationTyping = true;
}


// ADVANCE CONVERSATION

function advanceConversation() {
  if (!conversationActive) return;

  // First press finishes the typewriter effect.
  if (conversationTyping) {
    const line = currentConversation[conversationIndex];

    conversationText.textContent = line.text;
    conversationTyping = false;
    return;
  }

  conversationIndex++;

  if (conversationIndex >= currentConversation.length) {
    finishConversation();
    return;
  }

  displayConversationLine();
}


// FINISH CONVERSATION

function finishConversation() {
  conversationActive = false;

  conversationBox.classList.add("hidden");

  currentConversation = [];
  conversationIndex = 0;

  if (typeof showEndingScreen === "function") {
    showEndingScreen();
  }
}


// CHECK CONVERSATION STATE

function isConversationActive() {
  return conversationActive;
}


// ========================================
// UPDATE
// ========================================

function updateDialogue(dt) {

  // Conversation typewriter
  if (conversationActive && conversationTyping) {
    conversationTypewriterTimer += dt;

    while (
      conversationTypewriterTimer >= CONVERSATION_TYPEWRITER_SPEED
    ) {
      conversationTypewriterTimer -= CONVERSATION_TYPEWRITER_SPEED;

      const line = currentConversation[conversationIndex];

      if (!line) break;

      conversationTypewriterIndex++;

      conversationText.textContent = line.text.slice(
        0,
        conversationTypewriterIndex
      );

      if (conversationTypewriterIndex >= line.text.length) {
        conversationTyping = false;
        break;
      }
    }

    return;
  }

  // Journey message typewriter
  if (currentJourneyMessage) {
    const message = currentJourneyMessage;
    const textElement = journeyMessage?.querySelector(".message-text");

    if (message.typewriter && journeyTypewriterIndex < message.text.length) {
      journeyTypewriterIndex += Math.max(1, Math.floor(dt * 35));

      if (textElement) {
        textElement.textContent = message.text.slice(
          0,
          journeyTypewriterIndex
        );
      }
    } else {
      journeyTimer -= dt;

      if (journeyTimer <= 0) {
        hideJourneyMessage();
      }
    }

    return;
  }

  // Show the next queued message
  showNextJourneyMessage();
}


// ========================================
// RESET
// ========================================

function resetDialogue() {
  journeyQueue = [];
  currentJourneyMessage = null;
  journeyTimer = 0;
  journeyTypewriterIndex = 0;

  conversationActive = false;
  currentConversation = [];
  conversationIndex = 0;
  conversationTyping = false;
  conversationTypewriterIndex = 0;
  conversationTypewriterTimer = 0;

  clearTimeout(journeyHideTimer);

  if (journeyMessage) {
    journeyMessage.classList.remove("visible");
    journeyMessage.classList.add("hidden");
  }

  if (conversationBox) {
    conversationBox.classList.add("hidden");
  }
}


// BUTTON

if (dialogueButton) {
  dialogueButton.addEventListener("click", advanceConversation);
}
