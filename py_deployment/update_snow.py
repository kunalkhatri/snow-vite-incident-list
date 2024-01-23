from python_env import username,password
import os, fnmatch,json, time

# update following variables to reflect your instance

instance = "https://dev175973.service-now.com"


UI_PAGE_SYS_ID = "74e6c7ea97333110c7ffbed0f053af59"
UI_SCRIPT_SYS_ID = "84b20f6297333110c7ffbed0f053afb2"
STYLE_SHEET_SYS_ID = "e7f587aa97333110c7ffbed0f053afea"

ASSETS_FOLDER_PATH = "../dist/assets"
INDEX_HTML_PATH  = "../dist/"

def find(pattern, path):
    result = []
    for root, dirs, files in os.walk(path):
        for name in files:
            if fnmatch.fnmatch(name, pattern):
                result.append(os.path.join(root, name))
    return result

JS_FILE  = open(find('*.js', ASSETS_FOLDER_PATH)[0]) 
CSS_FILE = open(find('*.css', ASSETS_FOLDER_PATH)[0])

JS_FILE_CONTENT = JS_FILE.read()
CSS_FILE_CONTENT = CSS_FILE.read()

requests_header = {"Accept":"application/json"}
import requests


# updating css file first
css_updation = requests.patch(f"{instance}/api/now/table/content_css/{STYLE_SHEET_SYS_ID}",
                data=json.dumps({
                    "style":CSS_FILE_CONTENT
                }),
                auth=(username,password)
                )

if (css_updation.status_code == 200):
    print("CSS Successfully updated")
else:
    print(f"CSS Updation failed with {css_updation.status_code}")

# JS updation 
js_updation = requests.patch(f"{instance}/api/now/table/sys_ui_script/{UI_SCRIPT_SYS_ID}",
                             data = json.dumps({
                                 "script":JS_FILE_CONTENT
                             }),
                             auth=(username,password)
                             )

if(js_updation.status_code == 200):
    print("JS Updated successfully")
else:
    print(f"JS Updation failed with {js_updation.status_code}")


# updating ui page

# we would first update our index template to make sure it contains timestanp at end of js and css imports
# doing this, borwser should not load cached version of js and css once they are updated

def enhance_string(original, to_find, enhancement):
    index = original.find(to_find)
    
    if index != -1:
        modified_string = original[:index + len(to_find)] + enhancement + original[index + len(to_find):]
        return modified_string
    else:
        return original

UI_TEMPLATE = open("./index_template.html")
UI_TEMPLATE_CONTENT = UI_TEMPLATE.read()


UI_TEMPLATE_CONTENT = enhance_string(UI_TEMPLATE_CONTENT, ".cssdbx","?updated_" + str(int(time.time())) )
UI_TEMPLATE_CONTENT = enhance_string(UI_TEMPLATE_CONTENT, ".jsdbx", "?updated_" + str(int(time.time())) )



ui_page_updation = requests.patch(f"{instance}/api/now/table/sys_ui_page/{UI_PAGE_SYS_ID}",
                             data = json.dumps({
                                 "html":UI_TEMPLATE_CONTENT
                             }),
                             auth=(username,password)
                             )

if(ui_page_updation.status_code == 200):
    print("UI Page Updated successfully")
else:
    print(f"UI Page Updation failed with {ui_page_updation.status_code}")
