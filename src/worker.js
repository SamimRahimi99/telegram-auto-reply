export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Telegram Auto Reply Bot");
    }

    const update = await request.json();

    if (!update.message || !update.message.text) {
      return new Response("OK");
    }

    const chatId = update.message.chat.id;
    const messageId = update.message.message_id;
    const text = update.message.text.trim();

    // نمونه پاسخ
    if (text === "سلام") {
      await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: "علیک",
          reply_to_message_id: messageId
        })
      });
    }

    return new Response("OK");
  }
}