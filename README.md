# [Twitter Helpdesk](https://rp-helpdesk.herokuapp.com/)

Initially made as an assessment test for [Richpanel](https://richpanel.com/), this project is an twitter helpdesk which allows multiple users to login via twitter account and view the tweets which have mentioned them.
It uses sockets for realtime synchronisation of new mentioned tweets and replies with the twitter webhooks and streams.

> Deployed at [https://rp-helpdesk.herokuapp.com/](https://rp-helpdesk.herokuapp.com/)
 
## Run locally

```bash
git clone https://github.com/jaydattc/twitter-helpdesk
cd twitter-helpdesk
npm run install-deps
npm run start
```

### Run development backend server only

```bash
npm run server
```

### Run development backend server and client

```bash
npm run dev
```

## Features

- Login with twitter API
- Persist tweets in the database
- Get mentioned tweets and replies in realtime
