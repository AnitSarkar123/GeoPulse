require("dotenv").config();
const { cleanEnv, str, port, num } = require("envalid");

const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  NEWS_API_KEY: str(),
  OPENAI_API_KEY: str(),
  OPENAI_BASE_URL: str(),
  OPENAI_MODEL: str(),
  LLM_TIMEOUT: num({ default: 30000 }),
  MAX_EVENTS: num({ default: 100 }),
});

module.exports = {
  PORT: env.PORT,
  NEWS_API_KEY: env.NEWS_API_KEY,

  LLM: {
    URL: env.OPENAI_BASE_URL,
    MODEL: env.OPENAI_MODEL,
    TIMEOUT: env.LLM_TIMEOUT,
  },

  CACHE: {
    MAX_EVENTS: env.MAX_EVENTS,
  },
};
