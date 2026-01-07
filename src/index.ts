// ===============================
// 1️⃣ Imports & Environment Setup
// ===============================
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import boxen from "boxen";
import chalk from "chalk";

// ===============================
// 2️⃣ Safety Check (Professional)
// ===============================
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not found in .env file");
  process.exit(1);
}

// ===============================
// 3️⃣ Chat Bubble UI Helpers
// ===============================
function userBubble(text: string) {
  console.log(
    boxen(chalk.yellow(text), {
      title: "You",
      borderColor: "yellow",
      padding: 1,
    })
  );
}

function aiBubble(text: string) {
  console.log(
    boxen(chalk.cyan(text), {
      title: "AI",
      borderColor: "cyan",
      padding: 1,
    })
  );
}

// ===============================
// 4️⃣ Model Selection
// ===============================
const model = openai("gpt-4.1-mini");

// ===============================
// 5️⃣ System Prompt & Memory
// ===============================
const messages: {
  role: "system" | "user" | "assistant";
  content: any;
}[] = [
  {
    role: "system",
    content:
      "You are a friendly, helpful AI assistant. Respond clearly, politely, and in simple language.",
  },
];

// ===============================
// 6️⃣ Chat Function (Streaming)
// ===============================
async function chat(userInput: string) {
  messages.push({ role: "user", content: userInput });

  process.stdout.write(chalk.gray("\n🤖 AI is thinking"));
  const dots = setInterval(() => process.stdout.write("."), 400);

  const result = await streamText({ model, messages });

  clearInterval(dots);
  console.log("\n");

  let fullResponse = "";
  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
    fullResponse += chunk;
  }

  console.log("\n");
  aiBubble(fullResponse);

  messages.push({ role: "assistant", content: fullResponse });
}

// ===============================
// 7️⃣ Image Understanding
// ===============================
async function readImage(path: string) {
  try {
    const imageBuffer = fs.readFileSync(`./src/${path}`);

    process.stdout.write(chalk.gray("\n🖼️ AI is analyzing image"));
    const dots = setInterval(() => process.stdout.write("."), 400);

    const result = await streamText({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image in detail." },
            { type: "image", image: imageBuffer },
          ],
        },
      ],
    });

    let imageResponse = "";
    for await (const chunk of result.textStream) {
      imageResponse += chunk;
    }

    clearInterval(dots);
    console.log("\n");
    aiBubble(imageResponse);
  } catch {
    console.error(chalk.red(`❌ Image not found: ${path}`));
  }
}

// ===============================
// 8️⃣ Terminal Input Handler
// ===============================
function getInput(): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(chalk.green("\n> "));
    process.stdin.once("data", (data) =>
      resolve(data.toString().trim())
    );
  });
}

// ===============================
// 9️⃣ Main Application Loop
// ===============================
async function main() {
  console.log(
    boxen(
      chalk.bold("🤖 AI Chatbot Ready\n\n") +
        "• Type text to chat\n" +
        "• Type image:filename.jpg\n" +
        "• Type q to quit",
      { borderColor: "green", padding: 1 }
    )
  );

  while (true) {
    const input = await getInput();

    if (input.toLowerCase() === "q") break;

    if (input.startsWith("image:")) {
      const imagePath = input.replace("image:", "").trim();
      await readImage(imagePath);
    } else {
      userBubble(input);
      await chat(input);
    }
  }

  console.log(chalk.blue("\n👋 Goodbye!"));
}

main().catch(console.error);
