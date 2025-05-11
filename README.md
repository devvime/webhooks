# WebHooks

Simple webhoks for update projects on push event on git

### Install

Configure the .env file and install dependencies

```bash
npm i
```

### Start project

```bash
npm start
```

### PM2 Configuration

Install PM2 globally

```bash
npm i -g pm2
```
Start the process with a custom name

```bash
pm2 start npm --name webhooks -- run start
```

Save current process

```bash
pm2 save
```

Configure PM2 to restart after reboot

```bash
pm2 startup
```