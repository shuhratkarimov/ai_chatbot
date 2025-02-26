"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const bot = new node_telegram_bot_api_1.default(process.env.BOT_TOKEN, { polling: true });
bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    if (text.startsWith('/start')) {
        bot.sendMessage(chatId, 'Assalomu alaykum! Men Mistral AI chatbotman. Savollaringizga javob beraman.');
        return;
    }
    try {
        const response = yield axios_1.default.post('https://api.deepinfra.com/v1/openai/chat/completions', {
            model: 'mistralai/Mistral-7B-Instruct-v0.2',
            messages: [{ role: 'user', content: text }],
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPINFRA_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const reply = response.data.choices[0].message.content;
        bot.sendMessage(chatId, reply);
    }
    catch (error) {
        console.error('API xatosi:', error);
        bot.sendMessage(chatId, 'Kechirasiz, javob olishda xatolik yuz berdi.');
    }
}));
console.log('AI Chatbot ishlayapti...');
app.get("/", (req, res) => {
    res.send("Bot is running!");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
