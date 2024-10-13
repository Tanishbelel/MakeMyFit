/* eslint-disable space-before-function-paren */
/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable object-curly-spacing */
/* eslint-disable prefer-const */
/* eslint-disable semi */
document.addEventListener('DOMContentLoaded', function () {
  // Chatbot functionality
  const form = document.querySelector('.message-input form');
  const messageSend = document.querySelector('.message-send');
  const messagesContainer = document.querySelector('.messages-container');

  // To store the conversation history
  let conversationHistory = [
    {"content": "You are a fashion guru who gives personalized fashion advice", "role": "system"}
  ];

  // Handle form submit (user sends a message)
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const userMessage = messageSend.value.trim();

    if (userMessage) {
      // Display the user's message in the chat
      addMessageToChat('right', userMessage);
      messageSend.value = ''; // Clear the input

      // Append the user's message to the conversation history
      conversationHistory.push({ "content": userMessage, "role": "user" });

      // Send the conversation history to the Perplexity API
      callPerplexityAPI(conversationHistory)
        .then(botReply => {
          // Display the bot's response in the chat
          addMessageToChat('left', botReply);

          // Append the bot's response to the conversation history
          conversationHistory.push({ "content": botReply, "role": "assistant" });
        })
        .catch(error => {
          console.error('Error:', error);
          addMessageToChat('left', 'Sorry, something went wrong.');
        });
    }
  });

  // Function to add a message to the chat container
  function addMessageToChat(side, text) {
    const messageBox = document.createElement('div');
    messageBox.classList.add('message-box', side);
    messageBox.textContent = text;
    messagesContainer.appendChild(messageBox);

    // Scroll to the bottom of the chat container after each new message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Function to call the Perplexity API
  async function callPerplexityAPI(history) {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-chat",
        messages: history
      })
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', options);
    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content; // Bot's response
    } else {
      throw new Error('Invalid response from API');
    }
  }
});