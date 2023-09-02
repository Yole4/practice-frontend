import React, { useEffect, useState } from "react";
import axios from 'axios';

function App() {

  const backendUrl = "https://practice-backend-q7xj.onrender.com";
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [id, setId] = useState('');

  const [responseMessage, setResponse] = useState('');

  const [checker, setChecker] = useState(false);

  // inserting data
  const insert = async (e) => {
    e.preventDefault();

    const insertQuery = { name, course };
    try {
      const response = await axios.post(`${backendUrl}/insert`, insertQuery);
      if (response.status === 200) {
        setResponse(response.data.message);
        setChecker(checker ? false : true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setResponse(error.response.data.message);
      } else {
        console.log("Error: ", error);
      }
    }
  };

  // updating data
  const update = async (e) => {
    e.preventDefault();

    const updateQuery = { name, course, id };
    try {
      const response = await axios.post(`${backendUrl}/update`, updateQuery);
      if (response.status === 200) {
        setResponse(response.data.message);
        setChecker(checker ? false : true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setResponse(error.response.data.message);
      } else {
        console.log("Error: ", error);
      }
    }
  };

  // select
  const select = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/select`, { id });
      if (response.status === 200) {
        // setResponse(response.data.message);
        // setChecker(checker ? false : true);
        console.log("Selected: ",response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setResponse(error.response.data.message);
      } else {
        console.log("Error: ", error);
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/fetch`);
        if (response.status === 200) {
          // setResponse(response.data.message);
          console.log(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setResponse(error.response.data.message);
        } else {
          console.log("Error: ", error);
        }
      }
    }
    fetchData();
  }, [checker]);
  return (
    <div className="App">
      <div>
        <h1>Testing on render</h1>

        <input type="number" placeholder="id" value={id} onChange={(e) => setId(e.target.value)}  />
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="course" value={course} onChange={(e) => setCourse(e.target.value)}  required/><br /><br />

        <button type="submit" onClick={insert}>Insert</button>
        <button type="submit" onClick={select}>Select</button>
        <button type="submit" onClick={update}>Update</button>
      </div>
      <h1>{responseMessage}</h1>
    </div>
  );
}

export default App;
