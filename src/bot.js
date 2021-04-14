const TelegramBot = require("node-telegram-bot-api")
const config = require("./config/config")
const options = require("./options/options")
const pg = require("./lib/pg/pg")
const axios = require("axios").default;
const Table = require('cli-table');

async function getData(city , date ){
  let key = config.weatherapitoken;
  let options = {
    method: 'GET',
    url: 'http://api.weatherapi.com/v1/forecast.json',
    params: {
      key ,
      q : city,
      days:date,
      aqi:"no",
      alerts:"no",
      lang : "ru"
    }
  };
  return await axios.request(options).then(async res => res.data);
}

let getEmoji  = (code) => {
  let emojies = [
    {
      "code" : 1000,
      "emoji" : "☀️",
    },
    {
      "code" : 1003,
      "emoji" : "⛅",
    },
    {
      "code" : 1006,
      "emoji" : "☁️",
    },
    {
      "code" : 1009,
      "emoji" : "🌧",
    },
    {
      "code" : 1030,
      "emoji" : "🌫",
    },
    {
      "code" : 1063,
      "emoji" : "🌦",
    },
    {
      "code" : 1066,
      "emoji" : "🌨",
    },
    {
      "code" : 1069,
      "emoji" : "❄️",
    },
    {
      "code" : 1072,
      "emoji" : "🥶",
    },
    {
      "code" : 1087,
      "emoji" : "🌩",
    },
    {
      "code" : 1114,
      "emoji" : "🌬❄️",
    },
    {
      "code" : 1117,
      "emoji" : "🌪❄️",
    },
    {
      "code" : 1135,
      "emoji" : "🌁",
    },
    {
      "code" : 1147,
      "emoji" : "🥶🌁",
    },
    {
      "code" : 1150,
      "emoji" : "⚡️",
    },
    {
      "code" : 1153,
      "emoji" : "⚡️",
    },
    {
      "code" : 1168,
      "emoji" : "🌩🌨",
    },
    {
      "code" : 1171,
      "emoji" : "❄️🌧",
    },
    {
      "code" : 1180,
      "emoji" : "⛈",
    },
    {
      "code" : 1183,
      "emoji" : "🌦",
    },
    {
      "code" : 1186,
      "emoji" : "🌧",
    },
    {
      "code" : 1189,
      "emoji" : "🌧",
    },
    {
      "code" : 1192,
      "emoji" : "🌧",
    },
    {
      "code" : 1195,
      "emoji" : "🌧",
    },
    {
      "code" : 1198,
      "emoji" : "🌩🌨",
    },
    {
      "code" : 1201,
      "emoji" : "🌩🌨",
    },
    {
      "code" : 1204,
      "emoji" : "❄️",
    },
    {
      "code" : 1207,
      "emoji" : "🌨",
    },
    {
      "code" : 1210,
      "emoji" : "🌨",
    },
    {
      "code" : 1213,
      "emoji" : "🌨",
    },
    {
      "code" : 1216,
      "emoji" : "🌨",
    },
    {
      "code" : 1219,
      "emoji" : "🌨",
    },
    {
      "code" : 1222,
      "emoji" : "🌨",
    },
    {
      "code" : 1225,
      "emoji" : "🌨",
    },
    {
      "code" : 1237,
      "emoji" : "🧊",
    },
    {
      "code" : 1240,
      "emoji" : "🌧",
    },
    {
      "code" : 1243,
      "emoji" : "🌧",
    },
    {
      "code" : 1246,
      "emoji" : "🌧",
    },
    {
      "code" : 1249,
      "emoji" : "🌧",
    },
    {
      "code" : 1252,
      "emoji" : "🌦",
    },
    {
      "code" : 1255,
      "emoji" : "🌨",
    },
    {
      "code" : 1258,
      "emoji" : "🌨",
    },
    {
      "code" : 1261,
      "emoji" : "🧊",
    },
    {
      "code" : 1264,
      "emoji" : "🧊",
    },
    {
      "code" : 1273,
      "emoji" : "🌧",
    },
    {
      "code" : 1276,
      "emoji" : "🌧",
    },
    {
      "code" : 1279,
      "emoji" : "🌨",
    },
    {
      "code" : 1282,
      "emoji" : "🌨",
    }
  ]
  
  return emojies.find(obj => obj.code == code).emoji;
}

let  getMessage = async (data) => {
  let allData = data.forecast.forecastday[0]
  let text = `${allData.date + " " + allData.day.condition.text + " " + (getEmoji(allData.day.condition.code) || "")}\nMax temp : ${allData?.day?.maxtemp_c ? allData.day.maxtemp_c : ""} ℃\nMin temp : ${allData?.day?.mintemp_c ? allData.day.mintemp_c : ""} ℃\nВосход 🌅 : ${allData?.astro?.sunrise ? (allData.astro.sunrise) : ""}\nЗакат солнца 🌇 : ${allData?.astro?.sunset ? (allData.astro.sunset) : ""}\n`;

  for (let i = 0; i < allData.hour.length; i++) {
    const element = allData.hour[i];
    text += `\n${element.time.split(" ")[1]} ${element.condition.text} ${(getEmoji(element.condition.code) || "")}\nTemp : ${element.temp_c} ℃`
    if(i !== allData.hour.length - 1){
      text+="\n"
    }
  }
 
  return text
}

// -------------------------------------

const bot = new TelegramBot(config.token, {
  polling: true
})

bot.onText(/\/start/, async message => {
  const chatId = message.chat.id
  
  const foundUser = await pg(`SELECT user_id FROM users WHERE user_id = $1`, chatId)
  
  if (!foundUser.length) {
    await pg(`
    INSERT INTO users(
      user_id,
      user_first_name,
      user_last_name,
      user_username
      ) VALUES (
        $1, $2, $3, $4
        )
        `, chatId, message.chat.first_name, message.chat.last_name, message.chat.username)
      }
      
      const outputMessage = "Assalomu alaykum. Xush kelibsiz 😊";
      
      bot.sendMessage(chatId , outputMessage , options.startMenu)
    })
    
    bot.on("message", async message => {
      const chatId = message.chat.id
      const input = message.text
      
      if (input !== "/start") {
        
        const foundUser = await pg(`SELECT user_id FROM users WHERE user_id = $1`, chatId)
        
        if (!foundUser.length) {
          await pg(`
          INSERT INTO users(
            user_id,
            user_first_name,
            user_last_name,
            user_username
            ) VALUES (
              $1, $2, $3, $4
              )
              `, chatId, message.chat.first_name, message.chat.last_name, message.chat.username)
            }
            
          }
        });
        
        let time = null;
        
        bot.on("callback_query", async callback => {
          const callbackId = callback.id
          const callbackData = callback.data
          const chatId = callback.message.chat.id
          const messageId = callback.message.message_id
          
          if (callbackData == "today" || callbackData == "tomorrow"){
            if(callbackData == "today"){
              time = "today"
            }else if (callbackData == "tomorrow"){
              time = "tomorrow " ;
            }
            await bot.deleteMessage(chatId , messageId);
            await bot.sendChatAction(chatId , "typing");
            await bot.sendMessage(chatId, "Shahringizni tanlang 🌆" , options.regions);
          }else if (callbackData == "regions_back"){
            const outputMessage = "Assalomu alaykum. Xush kelibsiz 😊";
            
            await bot.deleteMessage(chatId , messageId);
            await bot.sendChatAction(chatId , "typing");
            await bot.sendMessage(chatId , outputMessage , options.startMenu)
          }else if (callbackData === 'weather_andijon') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("andijan", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_buxoro') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("bukhara", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_fargona') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("fergana", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_jizzax') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("jizzakh", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_xorazm') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("xorazm", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_namangan') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("namangan", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_navoiy') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("navoiy", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_qashqadaryo') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("qashqadaryo", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_qoraqalpogiston') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("nukus", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_samarqand') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("samarqand", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_sirdaryo') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("sirdaryo", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_surxondaryo') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId,await getMessage(await  getData("surxondaryo", time == "today" ? 1 : 2) ) )
          } else if (callbackData === 'weather_toshkent') {
            await bot.sendChatAction(chatId , "typing")
            await bot.sendMessage(chatId, await getMessage(await  getData("tashkent", time == "today" ? 1 : 2)))
          }
        })


