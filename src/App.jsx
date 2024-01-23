import { useState,useEffect } from 'react'
import images from './images.jsx'
import './App.css'
import axios_wrapper from './axios_wrapper.jsx'

const instance = import.meta.env.VITE_INSTANCE;

function App() {
  const [incidents,setIncidents] = useState([]);


  let rows = 10;
  let offset = 0;

  useEffect(()=>{
    axios_wrapper({
      url:"https://dev175973.service-now.com/api/now/table/incident?sysparm_limit=25"
    }).then(response=>{
      console.log("Authenticated",response);
      if (response.data.result){
        setIncidents(response.data.result);
      }
    }).catch(error=>{
      console.log("Error",error)
    });
  },
  [rows,offset])

  return (
    <>
      {import.meta.env.MODE == "development" &&
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">Hold up!</span> You are in development mode.
        </div>
      }
      <div>
        <h3>Current active incidents</h3>
        <ol>
          {incidents.map((incident,index)=>
            <a key={incident.sys_id} href={instance + "/nav_to.do?uri=incident&sys_id=" + incident.sys_id} 
                class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mt-2"
                target='_blank'
                >
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{index+1}. {incident.short_description}</h5>
              <p class="font-normal text-gray-700 dark:text-gray-400 text-sm ">{incident.sys_id}</p>
            </a>
          )}
          {
            (!incidents  || incidents.length < 1) &&
              <div>Loading data  .... </div>
          }
        </ol>
      </div>
    </>
  )
}

export default App
