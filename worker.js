export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Bot is running");
    }

    const update = await request.json();

    if (!update.message) {
      return new Response("OK");
    }

    const msg = update.message;
    const text = msg.text || "";

    if (text === "میو" || text === "مع") {
      const user = msg.from;
      const username = user.username
        ? `@${user.username}`
        : `[${user.first_name}](tg://user?id=${user.id})`;

      const reply = `${username} میو و دست خر`;

      await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            chat_id: msg.chat.id,
            text: reply,
            parse_mode: "Markdown"
          })
        }
      );
    }

    return new Response("OK");
  }
};