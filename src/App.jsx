import { useState,useEffect,useMemo } from 'react'
import './App.css'
import axios_wrapper from './axios_wrapper.jsx'

import { FaHandSparkles,FaExternalLinkAlt } from "react-icons/fa";

import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { FaHourglassHalf } from "react-icons/fa";


const instance = import.meta.env.VITE_INSTANCE;


function App() {

  const colDef = [
    {
      headerName:"Number",
      field:'number',
      flex:1
    },
    {
      headerName:"Short Description",
      field:'short_description',
      editable:true,
      flex:2,
    },
    {
      headerName:"Active",
      field:'active',
      type:'boolean',
      flex:1
    },
    {
      headerName:"Sys Id",
      field:'sys_id',
      flex:1,
    },
    {
      headerName:"Caller id",
      field:'caller_id',
      valueGetter:(params)=>params.row?.caller_id?.display_value ,
      flex:1
    },
    {
      headerName:"Link",
      field:'link',
      flex:0,
      renderCell:(params)=>(
        <Button variant="contained" onClick={()=>{window.open(`${instance}/incident.do?sys_id=${params.row.sys_id}`)}} endIcon={<FaExternalLinkAlt  />} >
          Link
        </Button>
      )
    },
    
  ]

  const [rows, setRows] = useState([]);
  const [is_data_loading,set_loading] = useState(false);

  const [snack_details , set_snack_details ] = useState({
    visible:false,
    message:"Placeholder message"
  });



  useEffect(()=>{
    set_loading(true);
    axios_wrapper({
      url:`${instance}/api/now/table/incident?sysparm_limit=25&sysparm_query=ORDERBYnumber&sysparm_display_value=true`
    }).then(response=>{
      console.log("Authenticated",response);
      if (response.data.result){
          setRows(response.data.result);
          set_loading(false);
      }
    }).catch(error=>{
      console.log("Error",error)
    });
  },
  [])

  const handleRowUpdate = (newRow,oldRow)=>{
    console.log("NEW ROW",newRow);
    set_loading(true);
    axios_wrapper({
      url:`${instance}/api/now/table/incident/${newRow.sys_id}`,
      method:'patch',
      data:{
        short_description:newRow.short_description
      }
    }).then(response=>{
      set_snack_details({
        visible:true,
        message:"Short description successfully updated."
      });
      setTimeout(()=>{
        set_snack_details({visible:false,message: snack_details.message });
      },3000);
      set_loading(false);
      
    })
    return newRow;
  }

  const handleProcessError = (error)=>console.log("Error detected ",error)

  return (
    <>
    {rows.length==0 && (
      <Alert icon={<FaHourglassHalf fontSize="inherit" />} severity="success">
        Please wait while we load the data...
      </Alert>
    )}
      <DataGrid 
        rows={rows}
        columns={colDef}
        getRowId={row=>row.sys_id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        loading={is_data_loading}
        processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={handleProcessError}
        style={{minHeight:500}}
      />
      {import.meta.env.MODE == "development" &&
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-rose-50 dark:bg-gray-800 dark:text-red-400 border border-solid  border-rose-500 flex gap-2 max-w-fit mx-auto mt-5" role="alert">
          <FaHandSparkles className='text-xl' /><span className="font-medium">Hold up!</span> You are in development mode. API instance : {instance}
        </div>
      }

      <Snackbar
        anchorOrigin={{horizontal:'right',vertical:'bottom'}} 
        open={snack_details.visible}
        message={snack_details.message}
        autoHideDuration={5000}
      
      />


    </>
  )
}

export default App
