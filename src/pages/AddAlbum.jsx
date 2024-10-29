import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';

const AddAlbum = () => {
  const [image, setImage] = useState(null);
  const [colour, setColour] = useState('#ffffff');
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState([]); // State for albums

  // Fetch albums from the API
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.albums) {
        setAlbums(response.data.albums); // Update state with the fetched albums
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      toast.error("Failed to fetch albums");
    }
  };

  // Call fetchAlbums on component mount
  useEffect(() => {
    fetchAlbums();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('image', image);
      formData.append('bgColour', colour);
  
      const response = await axios.post(`${url}/api/album/add`, formData);
  
      // Log the response data for debugging
      console.log("Response data:", response.data);
  
      if (response.data.success) {
        toast.success("Album Added");
        setDesc("");
        setImage(null);
        setName("");
        fetchAlbums(); // Refresh the album list after adding a new album
      } else {
        toast.error(response.data.message || "Something Went Wrong");
      }
    } catch (error) {
      console.error("Error occurred:", error.response ? error.response.data : error.message);
      toast.error("Error Occurred");
    }
    setLoading(false);
  };

  // Function to remove an album
  const removeAlbum = async (id) => {
    try {
      const response = await axios.post(`${url}/api/album/remove`, { id });
      if (response.data.success) {
        toast.success("Album Removed");
        fetchAlbums(); // Refresh the album list after removal
      } else {
        toast.error(response.data.message || "Failed to remove album");
      }
    } catch (error) {
      console.error("Error removing album:", error);
      toast.error("Error Occurred");
    }
  };

  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
      <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin'></div>
    </div>
  ) : (
    <div>
      <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
        {/* Form Inputs... */}
        <div className='flex flex-col gap-4'>
          <p>Upload Image</p>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id='image'
            accept='image/*'
            hidden
          />
          <label htmlFor="image">
            <img className='w-24 cursor-pointer' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload Area" />
          </label>
        </div>

        <div className='flex flex-col gap-2.5'>
          <p>Album Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]'
            type="text"
            placeholder='Album Name here'
          />
        </div>

        <div className='flex flex-col gap-2.5'>
          <p>Album Description</p>
          <input
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]'
            type="text"
            placeholder='Album Description here'
          />
        </div>

        <div className='flex flex-col gap-3'>
          <p>Background Colour</p>
          <input
            onChange={(e) => setColour(e.target.value)}
            value={colour}
            type="color"
          />
        </div>

        <button className='text-base bg-black text-white py-2.5 px-14 cursor-pointer' type="submit">
          Add Album
        </button>
      </form>

      {/* Albums Table */}
      <div className="mt-10">
        <h2 className="text-lg font-bold">Added Albums</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Background Color</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => (
              <tr key={album._id}>
                <td className="border border-gray-300 p-2">{album.name}</td>
                <td className="border border-gray-300 p-2">{album.desc}</td>
                <td className="border border-gray-300 p-2">
                  <div style={{ backgroundColor: album.bgColour, width: '20px', height: '20px', borderRadius: '50%' }}></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <button className="bg-red-500 text-white py-1 px-3 rounded" onClick={() => removeAlbum(album._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddAlbum;
