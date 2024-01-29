# React + Vite + ServiceNow

This is a simple experiment where we develop an UI page in React + Vite.
Steps to start with this Repo

### ServiceNow instance

1. Create a new app on servicenow
2. Create new `Scripted REST API`

    a. Create a new `Query Parameter`. Put in Queyr Parameter name as `file`. Associate with parent API definition create in step (2)

    b. Additionally create a new 'Resource' in newly created `Scripted REST API`
      - HTTP Method - Get
      - Relative path `/{file}`
      - Save the record once to obtain current record's sys_id. We will need it in the next step
      - Script : 
        ``` 
        function getRecentAttachmentWithSubstring(recordSysId, searchString) {
            var gr = new GlideRecord('sys_attachment');
            gr.addQuery('table_sys_id', recordSysId);
            gr.addQuery('file_name', 'CONTAINS', searchString);
            gr.orderByDesc('sys_created_on');
            gr.setLimit(1);
            gr.query();

            if (gr.next()) {
              var attachmentSysId = gr.getValue('sys_id');
              return gr;
            } else {
              return null;
            }
          }
          
          var current_record = "121f4d0c97408610c7ffbed0f053afc7"; // Insert the current record's sys_id here

          var search_string = request.pathParams.file;
          
          var return_file_id = getRecentAttachmentWithSubstring(current_record,search_string);

          var message = new GlideSysAttachment().getContent(return_file_id);

          if(search_string.indexOf("js") > -1){
            response.setContentType("text/javascript");
          } else {
            response.setContentType("text/css");
          }

          response.setStatus(200);
          response.getStreamWriter().writeString(message);
         ```
      - Uncheck `Required authentication` : We will be using this for delivering static files [ js, css ] and hence authentication is not required
      - Copy the `Resource Path`, we will need it for UI Page in step 3

3. Create a new UI Page
    - Check the option `Direct` : We don't want any styling or js include from ServiceNow as that might interfere with our code
    - HTML : 
      ```
      <?xml version="1.0" encoding="utf-8" ?>
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
          <!-- replace links in following two lines to Resouce Path we acquired in step 2 replacing the {file} with js and css respectively-->
          
          <script type="module"  src="/api/x_904640_react_inc/js_css_includes/js"></script>
          <link rel="stylesheet"  href="/api/x_904640_react_inc/js_css_includes/css" />
      </head>
      <body>
          <div id="root">
          Loading ....
        </div>
      </body>
      <script>
          window.servicenowUserToken="$[token]";
      </script>

      </html>

      </j:jelly>
      ```
4. Create CORS Rule [ System Web Services -> REST -> CORS Rules]
    - Check all HTTP Methods
    - Domain will be the domain you use for local development. In my case it is `http://localhost:5173`. It is the address VITE runs your development server after you run `npm run dev`



### VS Code 
1. Clone the git repo git@github.com:kunalkhatri/snow-vite-incident-list.git
2. Rename following 2 files
    1. sample.env, change it to .env
        Update the crendentials and instance details
        - username
        - password
        - instance url [ e.g. https://dev10011.service-now.com ]
        - sys_ws_operation_sys_id to sys_id of Resource created in step 2(d) in ServiceNow section
    2. sample.env.production, change it to env.production
        No need to modify anything in this file. You can leave it as such.


## That's it. You are now ready to work on your UI Page. 
  - Go edit the App.jsx
  - run `npm run dev`. Test your changes on local server [ http://localhost:5173]
  - once satisfied run `npm run deploy` it would upload the js and css files to Scripted Rest API resource