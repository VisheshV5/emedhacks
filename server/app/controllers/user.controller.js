const db = require("../models");
const User = db.user;
const Job = db.job;

const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const findById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ message: users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const createPreferences = async (req, res) => {
  const { description, amount, age, role, hours } = req.body;
  let retryCount = 3;

  const format = [
    {
      dailySchedule: [
        "X:XX AM - When they should wake up",
        "X:XX AM - what they should do after that",
        "X:XX AM - what after that",
        "X:XX PM - after that",
        "X:XX PM -after that",
        "X:XX PM - etc etc until schedule is complete for 24 hours",
      ],
      resource: [
        {
          name: "name",
          link: "resource link",
        },
      ],
    },
  ];

  while (retryCount > 0) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI that is able to generate a persons ideal daily scheudle based off of their condition and goals and also generate resources (links) for them to learn more about themselves in a JSON array. \nYou are to output the following in json format: ${JSON.stringify(
              format
            )} \nDo not put quotation marks or escape character \\ in the output fields.`,
          },
          {
            role: "user",
            content: `You are to generate a daily schedule the user must follow in order to manage their health so they can stay well knowing their condition is: age: ${age}, work position: ${role}, hours worked per day: ${hours} and their overall: ${description} and generate resources (links) for them to learn about patient literacy based off of their ${description} and that they know ${amount} about it and that they are ${age} years old.`,
          },
        ],
        temperature: 0,
        max_tokens: 900,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
      });

      const message = response.choices[0].message.content;
      const startIndex = message.indexOf("[");
      const endIndex = message.lastIndexOf("]") + 1;

      const jsonArrayString = message.slice(startIndex, endIndex);
      const finalList = JSON.parse(jsonArrayString);
      console.log("FIANSFJKNDFSKNDFJKDFHKDF", finalList[0]);

      const user = await User.findById(req.params.userId);

      const preferences = {
        dailySchedule: finalList[0]?.dailySchedule,
        resources: finalList[0]?.resource,
      };
      user.preferences = preferences;
      user.age = age;
      user.role = role;
      await user.save();

      res.send({ message: preferences });

      return;
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }

  res.status(500).send("Failed to generate schedule and links");
};

const checkSymptoms = async (req, res) => {
  const { symptoms } = req.body;
  let retryCount = 3;

  const format = [
    {
      potentialFiveSickness: [
        { name: "name", description: "description", cure: "ways to cure" },
        { name: "name", description: "description", cure: "ways to cure" },
        { name: "name", description: "description", cure: "ways to cure" },
        { name: "name", description: "description", cure: "ways to cure" },
        { name: "name", description: "description", cure: "ways to cure" },
      ],
    },
  ];

  while (retryCount > 0) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI that is able to help people identify what sickness they have based off of their symptoms, returned in a JSON array. \nYou are to output the following in json format: ${JSON.stringify(
              format
            )} \nDo not put quotation marks or escape character \\ in the output fields.`,
          },
          {
            role: "user",
            content: `You are to generate a list of 5 potential sicknesses that the user may have based off of their symptoms: ${symptoms}, their descriptions, and what they should do to cure them.`,
          },
        ],
        temperature: 0,
        max_tokens: 900,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
      });

      const message = response.choices[0].message.content;
      const startIndex = message.indexOf("[");
      const endIndex = message.lastIndexOf("]") + 1;

      const jsonArrayString = message.slice(startIndex, endIndex);
      const finalList = JSON.parse(jsonArrayString);
      console.log("FIANSFJKNDFSKNDFJKDFHKDF", finalList[0]);

      const user = await User.findById(req.params.userId);
      const illnesses = finalList[0].potentialFiveSickness;
      user.illnesses = illnesses;
      await user.save();

      res.send({ message: illnesses });

      return;
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }

  res.status(500).send("Failed to generate schedule and links");
};

module.exports = {
  findById,
  getAll,
  createPreferences,
  checkSymptoms,
};
