export function getAssistantReply(message: string) {

  const text = message.toLowerCase();

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello Shivam 👋 How can I help you today?";
  }

  if (text.includes("student")) {
    return "I can help you manage student records.";
  }

  if (text.includes("faculty")) {
    return "I can help you manage faculty information.";
  }

  if (text.includes("attendance")) {
    return "Attendance reports are available. What would you like to know?";
  }

  if (text.includes("course")) {
    return "I can provide course details and enrolled students.";
  }

  return "Sorry, I didn't understand that.";
}

