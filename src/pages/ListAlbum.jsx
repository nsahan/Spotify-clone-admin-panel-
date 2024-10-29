import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../App'; // Ensure this is the correct base URL for your API
import { toast } from 'react-toastify';

const ListAlbum = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAlbums = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            if (response.data.success) {
                setAlbums(response.data.albums);
            } else {
                toast.error(response.data.message || "Failed to fetch albums");
            }
        } catch (error) {
            console.error("Error occurred:", error.response ? error.response.data : error.message);
            toast.error("Error occurred while fetching albums");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            const response = await axios.post(`${url}/api/album/remove`, { id });
            if (response.data.success) {
                toast.success("Album removed successfully");
                fetchAlbums(); // Refresh the album list after removal
            } else {
                toast.error(response.data.message || "Failed to remove album");
            }
        } catch (error) {
            console.error("Error occurred:", error.response ? error.response.data : error.message);
            toast.error("Error occurred while removing album");
        }
    };

    useEffect(() => {
        fetchAlbums(); // Fetch albums when the component mounts
    }, []);

    if (loading) {
        return <div>Loading...</div>; // You can customize the loading UI
    }

    return (
        <div>
            <h2>Album List</h2>
            {albums.length === 0 ? (
                <p>No albums found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {albums.map(album => (
                            <tr key={album._id}>
                                <td>{album.name}</td>
                                <td>{album.desc}</td>
                                <td>
                                    <img src={album.imageUrl} alt={album.name} style={{ width: '100px' }} />
                                </td>
                                <td>
                                    <button onClick={() => handleRemove(album._id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListAlbum;
