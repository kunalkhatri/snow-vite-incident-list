# React + Vite + ServiceNow

This is a simple experiment where we develop an UI page in React + Vite.
Steps to start with this Repo

1. Clone the repo
2. Rename two environment files
  1. sample.env -> .env

    Fill in the necessary details i.e. instance [ e.g. httsp://dev001.service-now.com], admin username and password

  2. sample.env.production -> env.production

    No changes required

3. Edit deploy_snow.js
    Replace target_record_sys_id with your Scripted Rest end point resource sys_id. This is where JS and CSS are uploaded as attachment.


### Voila your development environment is now setup

#### Command to build the deployment resources
```javascript
npm run build
```

#### Once built, deploy
```javascript
npm run deploy
```