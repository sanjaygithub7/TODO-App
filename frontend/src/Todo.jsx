import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todo, setTodo] = useState([]);
  const [message, setMessage] = useState("");

  const [editid, setEditid] = useState(-1);
  const [edittitle, setEdittitle] = useState("");
  const [editdescription, setEditdescription] = useState("");

  const [deleteid,setDeleteid]=useState()
  const [deletemessage, setDeletemessage] = useState("");

  const handlesubmit = () => {
    addtask();
  };

  // Function to add a new task
  const addtask = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle === '' && trimmedDescription === '') {
      console.error("Title and description cannot be empty");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/todo', {
        title: trimmedTitle,
        description: trimmedDescription,
      });

      setTodo([...todo, response.data]);
      setTitle("");
      setDescription("");
      setMessage("Item Added Successfully");
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.log("Error in creating task", error);
    }
  };

  useEffect(() => {
    getitems();
  }, []);

  // Function to fetch all tasks
  const getitems = async () => {
    try {
      const getall = await axios.get('http://localhost:3000/todo');
      setTodo(getall.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle edit mode
  const handleedit = (item) => {
    setEditid(item._id);
    setEdittitle(item.title);
    setEditdescription(item.description);
  };

  // Function to update an existing task
  const handleUpdate = async () => {
    const trimmedTitle = edittitle.trim();
    const trimmedDescription = editdescription.trim();

    if (trimmedTitle === '' && trimmedDescription === '') {
      console.error("Title and description cannot be empty");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/todo/${editid}`, {
        title: trimmedTitle,
        description: trimmedDescription,
      });

      if (response.status === 200) {
        const updatedtodo = todo.map((item) => {
          if (item._id === editid) {
            return { ...item, title: trimmedTitle, description: trimmedDescription };
          }
          return item;
        });

        setTodo(updatedtodo);
        setMessage("Item Updated Successfully");
        setTimeout(() => {
          setMessage('');
        }, 3000);
        setEditid(-1); // Reset edit mode
        setEdittitle("");
        setEditdescription("");
      }
    } catch (error) {
      console.log("Error in updating task", error);
    }
  };

  const handlecancel = () => {
    setEditid(-1);
    setEdittitle("");
    setEditdescription("");
  };

  const handledelete=async(item)=>{

    setDeleteid(item._id)

    try{
      await axios.delete(`http://localhost:3000/todo/${item._id}`)
      console.log('item deleted successfully')

      const updated = todo.filter(deletion => deletion._id !== item._id)
      setTodo(updated)
      setDeletemessage("Item Deleted Successfully");
      setTimeout(() => {
        setDeletemessage('');
      }, 3000);
    }catch(error){
      console.log(error)
    }

  }

  return (
    <main className="font-mono">
    <div className="bg-blue-400">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center py-4 font-mono text-white">
        TODO APP
      </h1>
    </div>
  
    <div className="mt-4 ml-4 sm:ml-10">
      <h3 className="text-xl sm:text-2xl">Add Item</h3>
      {message && <p className="text-green-500 text-lg sm:text-xl">{message}</p>}
      {deletemessage && <p className='text-red-500 text-lg sm:text-xl'>{deletemessage}</p> }
    </div>
  
    <div className="mt-4 flex flex-col items-center sm:flex-row sm:justify-center sm:ml-10 space-y-4 sm:space-y-0 sm:space-x-2">
      <input
        type="text"
        className="border border-black px-6 sm:px-8 lg:px-32 py-2 rounded-sm w-full sm:w-auto"
        placeholder="TITLE"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        className="border border-black px-6 sm:px-8 lg:px-32 py-2 rounded-sm w-full sm:w-auto"
        placeholder="DESCRIPTION"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="submit"
        value="Submit"
        className="bg-black text-white px-6 py-2 rounded-md w-10%"
        onClick={handlesubmit}
      />
    </div>
  
    <section>
      <h3 className="text-xl sm:text-2xl ml-4 sm:ml-10 mt-10">Tasks</h3>
  
      {todo.map((item) => (
        <div
          key={item._id}
          className="mt-6 mx-4 sm:mx-10 lg:mx-24 p-4 sm:p-6 lg:p-10 rounded-md bg-blue-300 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0"
        >
          <div className="flex flex-col space-y-2">
            {editid === item._id ? (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  className="border border-black px-4 sm:px-8 lg:px-24 py-2 rounded-sm w-full sm:w-auto"
                  placeholder="TITLE"
                  value={edittitle}
                  onChange={(e) => setEdittitle(e.target.value)}
                />
                <input
                  type="text"
                  className="border border-black px-4 sm:px-8 lg:px-24 py-2 rounded-sm w-full sm:w-auto"
                  placeholder="DESCRIPTION"
                  value={editdescription}
                  onChange={(e) => setEditdescription(e.target.value)}
                />
              </div>
            ) : (
              <>
                <p className="text-lg sm:text-xl font-bold">{item.title}</p>
                <p className="text-base sm:text-lg">{item.description}</p>
              </>
            )}
          </div>
  
          <div className="flex space-x-2 sm:space-x-3 mt-2 sm:mt-0">
            {editid === item._id ? (
              <>
                <button className="bg-yellow-300 text-black p-2 rounded-md w-full sm:w-auto" onClick={handleUpdate}>
                  Update
                </button>
                <button className="bg-red-500 text-white p-2 rounded-md w-full sm:w-auto" onClick={handlecancel}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="bg-yellow-300 text-black p-1 px-4 rounded-md w-full sm:w-auto" onClick={() => handleedit(item)}>
                  Edit
                </button>
                <button className="bg-red-500 text-white p-1.5 px-4 rounded-md w-full sm:w-auto" onClick={() => handledelete(item)}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </section>
  </main>
  
  );
}
