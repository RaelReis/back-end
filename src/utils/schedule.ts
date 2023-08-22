import schedule from "node-schedule";

import { prismaClient } from "../database/primsaClient";

const dailyRule = new schedule.RecurrenceRule();
dailyRule.hour = 0;
dailyRule.minute = 0;
dailyRule.tz = "America/Sao_Paulo";

const weeklyRule = new schedule.RecurrenceRule();
weeklyRule.dayOfWeek = 4; // Quinta-feira
weeklyRule.hour = 0; // Meia-noite
weeklyRule.minute = 0;
weeklyRule.tz = "America/Sao_Paulo";

schedule.scheduleJob(dailyRule, () => {
  console.log("Reseting dailies");
  prismaClient.daily.updateMany({
    data: {
      isCompleted: false,
    },
  });
});

schedule.scheduleJob(weeklyRule, () => {
  console.log("Reseting weekly");
  prismaClient.weekly.updateMany({
    data: {
      isCompleted: false,
    },
  });
});
