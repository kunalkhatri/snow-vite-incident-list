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

// replace this with your scripted rest end point sys_id
const target_record_sys_id = "2d2e894583084210f8bd9796feaad3b6"
const target_table = "sys_ws_operation"

let js_filename = `js_chunk_${Date.now()}.js`;
let css_filename = `css_file_${Date.now()}.css`;


// let's upload css include file first

fs.readFile(findFirstFile(process.cwd() + "/dist/assets/", ".css"), "utf-8", (err, data) => {
    axios({
        method:"POST",
        url:`${instance}/api/now/v1/attachment/file?table_name=${target_table}&table_sys_id=${target_record_sys_id}&file_name=${css_filename}`,
        auth: {
            username: username,
            password: password
        },
        headers:{
            "Content-Type":"text/plain",
            "Accept":"application/json"
        },
        data:data
    }).then(response=>{
        if (response.status>199 && response.status < 300  ) {
            console.log("CSS File uploaded successfully");
        }
        else {
            console.log("CSS Upload failed with status code " + response.status);
        }
    }).catch(err => {
        console.log("API call to snow failed with : ", err);
    });
});


// let's upload js file second

fs.readFile(findFirstFile(process.cwd() + "/dist/assets/", ".js"), "utf-8", (err, data) => {
    axios({
        method:"POST",
        url:`${instance}/api/now/v1/attachment/file?table_name=${target_table}&table_sys_id=${target_record_sys_id}&file_name=${js_filename}`,
        auth: {
            username: username,
            password: password
        },
        headers:{
            "Content-Type":"text/plain",
            "Accept":"application/json"
        },
        data:data
    }).then(response=>{
        if (response.status > 199 && response.status < 300  ) {
            console.log("JS File uploaded successfully");
        }
        else {
            console.log("JS Upload failed with status code " + response.status);
        }
    }).catch(err => {
        console.log("API call to snow failed with : ", err);
    });
});