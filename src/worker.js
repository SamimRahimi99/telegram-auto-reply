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

    const adminId = "7244509871";

    // پنل مدیریت
    if (text === "/admin" && String(chatId) === adminId) {
      await sendMessage(env, chatId,
        "⚙️ پنل مدیریت\n\n"
        + "1- تغییر پاسخ سلام\n"
        + "برای تغییر بنویس:\n"
        + "/sethello متن جدید"
      );
      return new Response("OK");
    }

    // تغییر متن پاسخ سلام
    if (text.startsWith("/sethello") && String(chatId) === adminId) {
      const newText = text.replace("/sethello", "").trim();

      if (newText) {
        await env.DB.put("hello_reply", newText);
        await sendMessage(env, chatId, "✅ پاسخ سلام تغییر کرد");
      }

      return new Response("OK");
    }


    // پاسخ سلام
    if (text === "سلام") {

      const reply =
        await env.DB.get("hello_reply")
        || "علیک";

      await sendMessage(env, chatId, reply, messageId);
    }


    return new Response("OK");
  }
};


async function sendMessage(env, chatId, text, replyTo = null) {

  await fetch(
    `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        ...(replyTo ? {
          reply_to_message_id: replyTo
        } : {})
      })
    }
  );

}