const { REST, DiscordAPIError } = require("@discordjs/rest");
const {
  Routes,
  ApplicationCommandOptionType,
} = require("discord-api-types/v9");

const TOKEN = "ODgzNTg5NzM5NTYxNzQ2NDUz.YTMJEg.MwslIa9xBN25ah9LX5KzuYBYM5c";
const CLIENT_ID = "883589739561746453";
const GUILD_ID = "787875527670497322";

const ALPHABETS = [
  "🇦",
  "🇧",
  "🇨",
  "🇩",
  "🇪",
  "🇫",
  "🇬",
  "🇭",
  "🇮",
  "🇯",
  "🇰",
  "🇱",
  "🇲",
  "🇳",
  "🇴",
  "🇵",
  "🇶",
  "🇷",
  "🇸",
  "🇹",
  "🇺",
  "🇻",
  "🇼",
  "🇽",
  "🇾",
  "🇿",
];

var timerPairs = [];
var timerPair = {
  name: "",
  timeRemaining: 0,
  time: 0,
  interaction: undefined,
};
var timerCount = 0;

var timerHandle = -1;

function AddTimer(name, time, interaction) {
  var newTimerPair = { ...timerPair };
  newTimerPair.name = name;
  newTimerPair.time = time;
  newTimerPair.timeRemaining = time;
  newTimerPair.interaction = interaction;

  timerCount++;

  timerPairs.push(newTimerPair);

  if (timerHandle < 0) {
    timerHandle = setInterval(TickTimers, 1000);
  }
}

function TickTimers() {
  if (timerPairs.length === 0) {
    return;
  }

  // tick down
  for (let timer of timerPairs) {
    timer.timeRemaining -= 1;

    //console.log(`Timer: ${timer.name} remaining ${timer.timeRemaining}`);

    // announce timer ended
    if (timer.timeRemaining <= 0) {
      let message = `<@${timer.interaction.user.id}> Your timer: ${timer.name} is over`;
      console.log("FollowUp: " + message);
      timer.interaction.followUp({ content: message, ephemeral: true });
    }
  }

  // auto prune expired timers
  timerPairs = timerPairs.filter((timer) => {
    return timer.timeRemaining > 0;
  });

  if (timerPairs.length === 0) {
    clearInterval(timerHandle);
    timerHandle = -1;
  }
}

async function poll(interaction) {
  let topic = interaction.options.getString("topic");
  let firstOption = interaction.options.getString("option1");
  let secondOption = interaction.options.getString("option2");
  let thirdOption = interaction.options.getString("option3");
  let fourthOption = interaction.options.getString("option4");

  const embed = new MessageEmbed();
  const options = [];
  if (firstOption) {
    options.push(ALPHABETS[0] + " " + firstOption);
  }
  if (secondOption) {
    options.push(ALPHABETS[1] + " " + secondOption);
  }
  if (thirdOption) {
    options.push(ALPHABETS[2] + " " + thirdOption);
  }
  if (fourthOption) {
    options.push(ALPHABETS[3] + " " + fourthOption);
  }

  // building the message
  if (options.length > 1) {
    await interaction.channel
      .send(`📊 - ${topic}\n\n${options.join("\n\n")}`)
      .then((message) => {
        for (let i = 0; i < options.length; i++) {
          message.react(ALPHABETS[i]);
        }
      });
  } else {
    await interaction.channel
      .send(`📊 - ${topic}\n\n${options.join("\n\n")}`)
      .then((message) => {
        message.react('👍');
        message.react('👎');
      });
  }
}

const commands = [
  {
    name: "hihi",
    description: "Replies with a random hello.",
  },
  {
    name: "roll",
    description: "Replies with result of a dice roll.",
    options: [
      {
        name: "sides",
        description: "number of sides",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
  {
    name: "nationalize",
    description: "invoke the nationization scheme",
  },
  {
    name: "timer",
    description: "Starts an internal timer for x minutes.",
    options: [
      {
        name: "minutes",
        description: "x minutes.",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
      {
        name: "title",
        description: "title of the timer",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },
  {
    name: "poll",
    description: "Starts a poll for a topic with options (max 4). If 1 or less option given, it is a 👍 👎 question.",
    options: [
      {
        name: "topic",
        description: "topic of choice for the poll.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "option1",
        description: "name of option 1",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "option2",
        description: "name of option 2",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "option3",
        description: "name of option 3",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "option4",
        description: "name of option 4",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },
];

const greetings = [
  "Hello.",
  "Hi. My name is Kodama-bot.",
  "Hey.",
  "What's up?",
  "How's it going?",
  "How are you?",
  "How have you been?",
  "What's new?",
];

const rest = new REST({
  version: "9",
}).setToken(TOKEN);

(async () => {
  try {
    console.log("started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "hihi") {
    let randIndex = Math.floor(Math.random() * greetings.length);
    let reply = greetings[randIndex] + " " + interaction.user.username;
    await interaction.reply(reply);
  } else if (interaction.commandName === "roll") {
    let sides = interaction.options.getInteger("sides");
    console.log(
      `${interaction.user.username} called roll - sent sides of ${sides}`
    );
    if (sides <= 0) {
      await interaction.reply("We cannot have a dice of sides 0 or lower.");
    } else if (sides == 1) {
      await interaction.reply(
        "Dice of 1 can only roll 1. What did you expect!?"
      );
    } else {
      let result = Math.round(Math.random() * sides);
      await interaction.reply(`You rolled: ${result} / ${sides}`);
    }
  } else if (interaction.commandName === "nationalize") {
    const comrade = client.emojis.cache.find(
      (emoji) => emoji.name === "blobcomrade"
    );
    await interaction.reply(
      `${comrade} ${comrade} ${comrade} WE NEED TO NATIONALIZE THIS ${comrade} ${comrade} ${comrade}`
    );
  } else if (interaction.commandName === "timer") {
    let minutes = interaction.options.getInteger("minutes");
    let seconds = minutes * 60;
    let title = interaction.options.getString("title", false);
    if (title === undefined || title === null || title === "") {
      title = `Timer #${timerCount}`;
    }
    AddTimer(title, seconds, interaction);
    let message = `Timer : ${title} is set for ${minutes} minute(s) / ${seconds} second(s)`;
    console.log(`${interaction.user.username} called timer - ${message}`);
    await interaction.reply({ content: message, ephemeral: true });
  } else if (interaction.commandName === "poll") {
    poll(interaction);
    await interaction.reply({ content: "Poll created.", ephemeral: true });
  }
});

client.login(TOKEN);
