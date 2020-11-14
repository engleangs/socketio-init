const chat = {};
const last = [
    "Hi are you there ?",
    "Hey I need your support!",
    "This is the sample chat",
    "Do you know about this ?",
    "This is the test msg",
    "I cannot work on this",
    "Please could you call me?"
];
const reply = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nec feugiat nisl pretium fusce.",
    "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi egestas dui sit amet metus posuere, at tempor felis semper. Suspendisse."
];
chat.random_integer = (length) => {
    return Math.floor(Math.random() * length);
};

chat.random_last_msg = () => {
    return last[chat.random_integer(last.length)];
};
chat.random_reply = () => {
        return reply[ chat.random_integer( reply.length)];
};

module.exports = chat;