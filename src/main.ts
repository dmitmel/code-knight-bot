#!/usr/bin/env node
import * as discord from 'discord.js';

const secrets: { token: string } = require('../secrets.json');

const client = new discord.Client();

const KDBOT_MESSAGE_CLEANUP_GUILD_IDS = new Set([
  '382339402338402315',
  '500980710870614019',
  '785196930523332618',
]);
const KDBOT_USER_IDS = new Set(['414925323197612032', '708971789446938664']);
const BLOCKED_MESSAGE_PATTERNS = [
  /^<@!?\d+>, I'm not playing anything!$/,
  /^The current TTS command is not done!$/,
  /^You're not in a voice channel!$/,
  /^<@!?\d+>, I'm not in a voice channel!$/,
];

const MENTION_RESPONSE_PROBABILITY = 0.5;
const MENTION_RESPONSES = [
  'There are many strange places in this world...',
  'Es gibt viele seltsame Orte in dieser Welt...',
  '这个世界有许多奇怪的地方...',
  '這個世界有許多奇怪的地方...',
  '이 세계엔 이상한 곳이 많네...',
  'この世界には奇妙な場所がいっぱいあるんだね...',
  'Есть много странных мест в этом мире...',
  "Il y a tellement d'endroits étranges dans ce monde...",
];

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on('message', (msg: discord.Message) => {
  if (
    msg.channel instanceof discord.TextChannel &&
    KDBOT_MESSAGE_CLEANUP_GUILD_IDS.has(msg.channel.guild.id) &&
    KDBOT_USER_IDS.has(msg.author.id) &&
    BLOCKED_MESSAGE_PATTERNS.some((p) => p.test(msg.content))
  ) {
    msg.delete({ timeout: 2000, reason: 'KDBot spam cleanup' });
  }

  if (msg.mentions.users.has(client.user!.id) && Math.random() < MENTION_RESPONSE_PROBABILITY) {
    msg.channel.send(MENTION_RESPONSES.join('\n'));
  }
});

client.login(secrets.token);
