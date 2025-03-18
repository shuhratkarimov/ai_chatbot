import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import dotenv from 'dotenv';
import express, { Request, Response } from "express";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.BOT_TOKEN as string, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';

    if (text.startsWith('/start')) {
        bot.sendMessage(chatId, 'Hello! I am an AI and can answer any of your questions!.');
        return;
    }

    try {
        const response = await axios.post(
            'https://api.deepinfra.com/v1/openai/chat/completions',
            {
                model: 'mistralai/Mistral-7B-Instruct-v0.2',
                messages: [{ role: 'user', content: text }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.DEEPINFRA_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const reply = response.data.choices[0].message.content;
        bot.sendMessage(chatId, reply);
    } catch (error) {
        console.error('API error:', error);
        bot.sendMessage(chatId, 'Sorry, error occured while getting answer...');
    }
});

console.log('AI Chatbot is working...');

app.get("/", (req: Request, res: Response) => {
    res.send("Bot is running!");
  });

  setInterval(() => {
    fetch("https://ai-chatbot-6dqz.onrender.com").catch(err => console.log("Ping error:", err));
  }, 10 * 60 * 1000);
  

  setInterval(() => {
    fetch("https://ai-chatbot-6dqz.onrender.com").catch(() => {});
  }, 5 * 60 * 1000); // 5 daqiqada bir ping
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });