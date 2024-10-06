import React, { useState, useEffect } from 'react';
import { createPlace,getAllPlaces,updatePlace  } from '../api';
import '../styling/GovornorDashboard.css';


const GovornorDashboard = () => {
    const [newPlace,setNewPlace]=useState({
        name: '',
        description : '',
        location : '',
        openingHours :'',
        ticketPrices:{
            foreigner: 0,
            native: 0,
            student: 0
        }
    });
const [places,setPlaces]=useState([]);
const [selectedPlace, setSelectedPlace] = useState(null);

useEffect(()=>{
    const fetchPlaces = async () => {
        const placesData = await getAllPlaces();
        setPlaces(placesData);
    };
    fetchPlaces(); 
},[]);


const handleAddPlace = async (e) => {
    e.preventDefault();
    try {
        const response = await createPlace(newPlace)
     
        setNewPlace({
            name: '',
            description: '',
            location: '',
            openingHours :'',
            ticketPrices: { foreigner: 0, native: 0, student: 0 }
           

        });
    
    console.log(newPlace);
    const updatedPlaces = await getAllPlaces();
    setPlaces(updatedPlaces);
     alert(response.message || "Place added successfully");
      
        

       
    } catch (error) {
        console.error('Error adding place:', error);
        alert('Failed to add place.');
    }
};

const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [outerKey, innerKey] = name.split('.');
        setNewPlace(prevState => ({
            ...prevState,
            [outerKey]: {
                ...prevState[outerKey],
                [innerKey]: value
            }
        }));
    } else {
    setNewPlace(prevState => ({
        ...prevState,
        [name]: value
    }));
} 
};

 const handleEditPlace = async (updatedPlace) => {
    const { placeId, ...placesData } = updatedPlace;
    try {
        const response = await updatePlace(placeId, placesData);
        setSelectedPlace(null);
        const updatedPlaces = await getAllPlaces();
        setPlaces(updatedPlaces);
        alert(response.message || "Place updated successfully");
    } catch (error) {
        alert('Failed to update place.');
    }
};
    return (
        <div className="governor-dashboard">
        <h1>Govornor Dashboard </h1>
        
        <h2>Add New Place</h2>
        <form onSubmit={handleAddPlace}>
            <label>
                Name:
                <input type="text" name="name" value={newPlace.name} onChange={handleInputChange} required />
            </label>
            <label>
                Description:
                <input type="text" name="description" value={newPlace.description} onChange={handleInputChange} required />
            </label>
            <label>
                Location:
                <input type="text" name="location" value={newPlace.location} onChange={handleInputChange} required />
            </label>
            <label>
                 Opening Hours:
               <input type="text" name="openingHours" value={newPlace.openingHours} onChange={handleInputChange} required />
              </label>

            <label>
                Foreigner Ticket Price:
                <input type="number" name="ticketPrices.foreigner" value={newPlace.ticketPrices.foreigner} onChange={handleInputChange} required />
            </label>
            <label>
                Native Ticket Price:
                <input type="number" name="ticketPrices.native" value={newPlace.ticketPrices.native} onChange={handleInputChange} required />
            </label>
            <label>
                Student Ticket Price:
                <input type="number" name="ticketPrices.student" value={newPlace.ticketPrices.student} onChange={handleInputChange} required />
            </label>
            <button type="submit">Add Place</button>
        </form>

        <h2>List of All Places</h2>
        <ul>
            {places.map(place => (
                <li key={place._id}>
                    <h3>{place.name}</h3>
                    <p>Description: {place.description}</p>
                    <p>Location: {place.location}</p>
                    <p>opening Hours: {place.openingHours}</p>
                    <p>Ticket Prices: 
                        <br />Foreigner: ${place.ticketPrices.foreigner} 
                        <br />Native: ${place.ticketPrices.native} 
                        <br />Student: ${place.ticketPrices.student}
                    </p>
                    <button onClick={() => setSelectedPlace(place)}>Edit</button>
                </li>
            ))}
        </ul>

        {selectedPlace && (
            <EditPlace
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
               onSave={handleEditPlace}
            />
        )}
    </div>
);
}

const EditPlace = ({ place, onClose, onSave }) => {
    const [name, setName] = useState(place.name);
    const [description, setDescription] = useState(place.description);
    const [location, setLocation] = useState(place.location);
    const [openingHours, setNewOpeningHours] = useState(place.openingHours);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedPlace = { 
            placeId:place._id, 
            name, 
            description,
            location, 
            openingHours 
            
        };
        onSave(updatedPlace);
    };

    return (
        <div className="edit-place">
            <h2>Edit Place</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                <label>Description:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

                <label>Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

                <label>Opening Hours:</label>
                <input type="text" value={openingHours} onChange={(e) => setNewOpeningHours(e.target.value)} />

                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default GovornorDashboard;