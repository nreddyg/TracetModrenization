import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";


function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    navigate('/layout')
  },[dispatch])
  
  return <div></div>
}

export default Home;
