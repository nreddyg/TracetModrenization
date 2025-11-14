import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from "react-router-dom";


function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location=useLocation()

  useEffect(()=>{
      console.log("home",location.pathname)
    navigate('/layout')
  },[dispatch])
  
  return <div></div>
}

export default Home;
