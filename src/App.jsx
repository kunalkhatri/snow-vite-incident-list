import { useState,useEffect } from 'react'
import images from './images.jsx'
import './App.css'
import axios_wrapper from './axios_wrapper.jsx'


function App() {
  const [incidents,setIncidents] = useState([]);


  let rows = 10;
  let offset = 0;

  useEffect(()=>{
    axios_wrapper({
      url:"https://dev175973.service-now.com/api/now/table/incident"
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
      <div>
        {incidents.map(incident=>
          <div key={incident.sys_id}>{incident.sys_id} ooga booga</div>
        )}

        {
          (!incidents  || incidents.length < 1) &&
            <div>No Data</div>
        }
      </div>

      <p>
        {import.meta.env.MODE}
      </p>
    </>
  )
}

export default App
