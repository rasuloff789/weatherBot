module.exports.startMenu = {
  reply_markup: JSON.stringify({
    resize_keyboard: true,
    one_time_keyboard: true,
    inline_keyboard: [
      [
        {
          text: "Bugungi ob-havo ma'lumotlari 🌤",
          callback_data:"today"
        }
      ],
      [
        {
          text: "Ertangi ob-havo ma'lumotlari 🌤",
          callback_data:"tomorrow"
        }
      ]
    ]
  })
}

module.exports.regions = {
  reply_markup: JSON.stringify({
    resize_keyboard: true,
    one_time_keyboard: true,
    inline_keyboard: [
      [
        {
          text: "Andijon",
          callback_data: "weather_andijon"
        },
        {
          text: "Buxoro",
          callback_data: "weather_buxoro"
        }
      ],
      [
        {
          text: "Fargʻona",
          callback_data: "weather_fargona"
        },
        {
          text: "Jizzax",
          callback_data: "weather_jizzax"
        }
      ],
      [
        {
          text: "Xorazm",
          callback_data: "weather_xorazm"
        },
        {
          text: "Namangan",
          callback_data: "weather_namangan"
        }
      ],
      [
        {
          text: "Navoiy",
          callback_data: "weather_navoiy"
        },
        {
          text: "Qashqadaryo",
          callback_data: "weather_qashqadaryo"
        }
      ],
      [
        {
          text: "Qoraqalpogʻiston",
          callback_data: "weather_qoraqalpogiston"
        },
        {
          text: "Samarqand",
          callback_data: "weather_samarqand"
        }
      ],
      [
        {
          text: "Sirdaryo",
          callback_data: "weather_sirdaryo"
        },
        {
          text: "Surxondaryo",
          callback_data: "weather_surxondaryo"
        }
      ],
      [
        {
          text: "Toshkent shahri",
          callback_data: "weather_toshkent"
        }
      ],
      [
        {
          text: "Orqaga ⬅️",
          callback_data: "regions_back"
        }
      ]
    ]
  })
}

module.exports.prayerTimesMenu = {
  parse_mode: "HTML",
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        {
          text: "Orqaga ⬅️",
          callback_data: "weather_back"
        }
      ]
    ]
  })
}