import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';

const AddSong = () => {
    const [image, setImage] = useState(null);
    const [song, setSong] = useState(null);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [album, setAlbum] = useState("none");
    const [loading, setLoading] = useState(false);
    const [albumData, setAlbumData] = useState([]); // State for album data
    const [songs, setSongs] = useState([]); // State for songs

    // Fetch songs from the API
    const fetchSongs = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`);
            if (response.data.songs) {
                setSongs(response.data.songs); // Update state with the fetched songs
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
            toast.error("Failed to fetch songs");
        }
    };

    // Fetch albums from the API
    const fetchAlbums = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`); // Adjust the URL based on your API
            if (response.data.albums) {
                setAlbumData(response.data.albums); // Update state with the fetched albums
            } else {
                toast.error("No albums found");
            }
        } catch (error) {
            console.error("Error fetching albums:", error);
            toast.error("Failed to fetch albums");
        }
    };

    // Call fetch functions on component mount
    useEffect(() => {
        fetchSongs();
        fetchAlbums(); // Call to fetch albums
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('image', image);
            formData.append('audio', song);
            formData.append('album', album);
    
            const response = await axios.post(`${url}/api/song/add`, formData);
    
            console.log("Response from server:", response.data);
    
            if (response.data && response.data.success) {
                toast.success("Song added successfully"); 
                setName("");
                setDesc("");
                setAlbum("none");
                setImage(null);
                setSong(null);
                fetchSongs(); // Refresh the song list after adding a new song
            } else {
                const message = response.data?.message || "Something went wrong";
                toast.error(message);
            }
        } catch (error) {
            console.error("Error details:", error.response ? error.response.data : error.message);
            toast.error("Error occurred: " + (error.response ? error.response.data.message : error.message));
        } finally {
            setLoading(false);
        }
    };

    // Function to remove a song
    const removeSong = async (id) => {
        try {
            const response = await axios.post(`${url}/api/song/remove`, { id });
            if (response.data.success) {
                toast.success("Song removed successfully");
                fetchSongs(); // Refresh the song list after removal
            } else {
                toast.error(response.data.message || "Failed to remove song");
            }
        } catch (error) {
            console.error("Error removing song:", error);
            toast.error("Error occurred while removing song");
        }
    };

    return loading ? (
        <div className='grid place-items-center min-h-[80vh]'>
            <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin'></div>
        </div>
    ) : (
        <>
            <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600 '>
                <div className='flex gap-8'>
                    <div className='flex flex-col gap-4'>
                        <p>Upload Song</p>
                        <input onChange={(e) => setSong(e.target.files[0])} type='file' id='song' accept='audio/*' hidden />
                        <label htmlFor='song'>
                            <img src={song ? assets.upload_added : assets.upload_song} className='w-24 cursor-pointer' alt="" />
                        </label>
                    </div>
                    <div className='flex flex-col gap-4 '>
                        <p>Upload Image</p>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
                        <label htmlFor="image">
                            <img src={image ? URL.createObjectURL(image) : assets.upload_area} className='w-24 cursor-pointer' alt="" />
                        </label>
                    </div>
                </div>

                <div className='flex flex-col gap-2.5'>
                    <p>Song Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Song Name Here' type="text" required />
                </div>

                <div className='flex flex-col gap-2.5'>
                    <p>Song Description</p>
                    <input onChange={(e) => setDesc(e.target.value)} value={desc} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Song Description Here' type="text" required />
                </div>

                <div className='flex flex-col gap-2.5'>
                    <p>Album</p>
                    <select onChange={(e) => setAlbum(e.target.value)} value={album} className='bg-transparent outline-gray-600 border-2 border-gray-400 p-2.5 w-[150px]'>
                        <option value="none">None</option>
                        {albumData.map((item) => (
                            <option key={item._id} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className='text-base bg-black text-white py-2.5 px-14 cursor-pointer'>Add Song</button>
            </form>

            {/* Songs Table */}
            <div className="mt-10">
                <h2 className="text-lg font-bold">Added Songs</h2>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Name</th>
                            <th className="border border-gray-300 p-2">Description</th>
                            <th className="border border-gray-300 p-2">Album</th>
                            <th className="border border-gray-300 p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map((song) => (
                            <tr key={song._id}>
                                <td className="border border-gray-300 p-2">{song.name}</td>
                                <td className="border border-gray-300 p-2">{song.desc}</td>
                                <td className="border border-gray-300 p-2">{song.album}</td>
                                <td className="border border-gray-300 p-2">
                                    <button className="bg-red-500 text-white py-1 px-3 rounded" onClick={() => removeSong(song._id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AddSong;
