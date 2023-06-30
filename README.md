# TwitterBot
# Cервис автоматического сбора информационных материалов из социальной сети микроблогов «Twitter»


1. Устанавить зависимости `npm install`
2. В ./.config добавить файл .env и настройте ключи
``` dotenv
    consumer_key:         apikey,
    consumer_secret:      apiSecretKey,
    access_token:         accessToken,
    access_token_secret:  accessTokenSecret,
```
3. Запустить 
``` javascript
    prod - npm run start 
    dev - npm run dev
```