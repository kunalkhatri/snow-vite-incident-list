import axios from "axios";
import * as fs from "fs";
import * as path from "path";

function findFirstFile(folderPath,extension='.js') {
    try {
        const files = fs.readdirSync(folderPath);
        const jsFiles = files.filter(file => path.extname(file) === extension);

        if (jsFiles.length > 0) {
            return path.join(folderPath, jsFiles[0]);
        } else {
            console.log("No JS files found in the given folder.");
            return null;
        }
    } catch (error) {
        console.error("Error reading the folder:", error.message);
        return null;
    }
}

const instance = process.env.VITE_INSTANCE;
const username = process.env.VITE_AUTH_USERNAME;
const password = process.env.VITE_AUTH_PASSWORD;

const UI_PAGE_SYS_ID = "74e6c7ea97333110c7ffbed0f053af59"
let UI_PAGE_NAME;
const UI_SCRIPT_SYS_ID = "84b20f6297333110c7ffbed0f053afb2"
const STYLE_SHEET_SYS_ID = "e7f587aa97333110c7ffbed0f053afea"

// let's update the sys-ui-script aka js include file first

fs.readFile(findFirstFile(process.cwd() + "/dist/assets/", ".js"), "utf-8", (err, data) => {
    axios({
        method: "patch",
        url: `${instance}/api/now/table/sys_ui_script/${UI_SCRIPT_SYS_ID}`,
        auth: {
            username: username,
            password: password
        },
        data: {
            script: data
        }
    }
    ).then(response => {
        console.log("UI Script was updated.");
    }).catch(err => {
        console.log("API call to snow failed with : ", err);
    });
    if (err) {
        console.log("UI Script couldn't be read. ");
    }
})


// now it's css file

fs.readFile(findFirstFile(process.cwd() + "/dist/assets/", ".css"), "utf-8",
    (err, data) => {
        axios({
            method: "patch",
            url: `${instance}/api/now/table/content_css/${STYLE_SHEET_SYS_ID}`,
            auth: {
                username: username,
                password: password
            },
            data: {
                style: data
            }
        }
        ).then(response => {
            console.log("CSS was updated.");
        }).catch(err => {
            console.log("API call to snow failed with : ", err);
        });
        if (err) {
            console.log("CSS file couldn't be read. ");
        }
    }
)

// finally HTML Page
// we need to modify css and js include URLs

axios({
    url: `${instance}/api/now/table/sys_ui_script/${UI_SCRIPT_SYS_ID}`,
    auth: {
        username: username,
        password: password
    }
}).then(get_response=>{
        UI_PAGE_NAME = get_response.data.result.name;
        let html_template = `<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">

<g:evaluate object="true">
    var session = gs.getSession();
    var token = session.getSessionToken();
    if (token=='' || token==undefined){
        token = gs.getSessionToken();
    }
</g:evaluate>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ViteReact testing for ServiceNow</title>
    <script type="module"  src="/${UI_PAGE_NAME}.jsdbx?updated_${Date.now()}"></script>
    <link rel="stylesheet"  href="${STYLE_SHEET_SYS_ID}.cssdbx?updated_${Date.now()}" />
</head>
<body>
    <div id="root"></div>
</body>
<script>
    window.servicenowUserToken="$[token]";
</script>

</html>

</j:jelly>`;
        axios({
            method:"patch",
            url:`${instance}/api/now/table/sys_ui_page/${UI_PAGE_SYS_ID}`,
            auth:{
                username:username,
                password:password
            },
            data:{
                html:html_template
            }
        }
        ).then(response=>{
            console.log("UI Page was updated.");
        }).catch(err=>{
            console.log("UI PAGE API call to snow failed with : ",err );
        });
    })