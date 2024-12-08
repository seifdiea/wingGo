// TourSingleCardIt.tsx

"use client";
import GetRatting from "@/hooks/GetRattingIt";
import { imageLoader } from "@/hooks/image-loader";
import useGlobalContext from "@/hooks/use-context";
import { Itinerary } from "@/interFace/interFace";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toggleFlagItinerary, toggleItineraryActivation, isItineraryBooked, toggleBookingState } from '@/api/itineraryApi';
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useCurrency } from "@/contextApi/CurrencyContext"; // Import currency context
import Modal from "react-modal"; // Import Modal from react-modal
import { toast } from 'sonner';

interface ItourPropsType {
  tour: Itinerary; // Use Itinerary type
  className: string;
  tourWrapperClass: string;
  isparentClass: boolean;
  isAdmin?: boolean; // Optional prop to check if the view is admin
  isTourGuide?: boolean; // Optional prop to check if the view is tour guide
}

const TourSingleCard = ({
  tour,
  className,
  tourWrapperClass,
  isparentClass,
  isAdmin = false,
  isTourGuide = false,
}: ItourPropsType) => {
  const { setModalData } = useGlobalContext();
  const rating = tour.averageRating ; // Use Itinerary's averageRating, default to 1
  const { currency, convertAmount } = useCurrency(); // Access currency and conversion function
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const router = useRouter(); // Initialize router

  // Local state to keep track of the flagged and deactivated status
  const [isFlagged, setIsFlagged] = useState(tour.flagged);
  const [isDeactivated, setIsDeactivated] = useState(tour.deactivated);

  const [isBooked, setIsBooked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [bookingState, setBookingState] = useState(tour.bookingOpen);
  const [modalAction, setModalAction] = useState(""); 
  


  useEffect(() => {
    const checkBookingStatus = async () => {
      try {
        const bookedStatus = await isItineraryBooked(tour._id); // Fetch booking status
        setIsBooked(bookedStatus);
      } catch (error) {
        console.error("Error checking booking status:", error);
      }
    };

    checkBookingStatus();
  }, [tour._id]);
  useEffect(() => {
    const convertTourPrice = async () => {
      if (tour.price) {
        const priceInSelectedCurrency = await convertAmount(tour.price);
        setConvertedPrice(priceInSelectedCurrency);
      }
    };
    convertTourPrice();
  }, [currency, tour.price, convertAmount]); // Re-run if currency or tour.price changes


  const handleFlagItinerary = async () => {
    setIsModalOpen(true);
  };

  const confirmFlagActivity = async () => {
    try {
        await toggleItineraryActivation(tour._id, !isDeactivated);
        setIsDeactivated((prevDeactivated) => !prevDeactivated);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error toggling activation status:", error);
      }
  };

  const handleToggleActivation = async () => {
    setIsModalOpen(true);
  };

  const handleBookNowClick = () => {
    router.push(`/booking-it/${tour._id}`);
  };

  const handleToggleBooking = (action: string) => {
    setModalAction(action); // Set the action (Open or Close)
    setIsModalOpen2(true); // Open the modal
  };
  
  const confirmToggleBooking = async () => {
    const toastId = toast.loading("Processing your Request...");
    try {
      const newBookingState = modalAction === "Open"; // Determine the new state
      await toggleBookingState(tour._id, newBookingState); // Call the backend API
      setBookingState(newBookingState); // Update state after successful API call
      setIsModalOpen2(false); // Close the modal
      console.log(`Booking state toggled to: ${newBookingState ? "Open" : "Closed"}`);
      toast.success(`Booking state toggled to ${newBookingState ? 'Open' : 'Closed'} successfully!`, { id: toastId, duration: 1000 });
    } catch (error) {
      console.error("Error toggling booking state:", error);
      toast.error('Failed to toggle booking state. Please try again.', { id: toastId });
    }
  };

  return (
    <>
      {isparentClass ? (
        <div className={className}>
          <div className={tourWrapperClass}>
            <div className="p-relative">
              <div className="tour-thumb image-overly">
                <Link href={`/it-details/${tour._id}`}>
                  <Image
                    src="/images/default-image.jpg"
                    loader={imageLoader}
                    width={270}
                    height={270}
                    style={{ width: "100%", height: "auto" }}
                    alt="Itinerary Image"
                  />
                </Link>
              </div>
              <div className="tour-meta d-flex align-items-center justify-content-between">
                <div className="tour-location">
                  <span>
                    <Link href={`/it-details/${tour._id}`}>
                      <i className="fa-regular fa-location-dot"></i>{" "}
                      {tour.locations[0] || "Location not available"}
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            <div className="tour-content">
              <div className="tour-rating d-flex align-items-center gap-10 mb-10">
                <div className="tour-rating-icon fs-14 d-flex rating-color">
                  <GetRatting averageRating={rating} ratingExists={tour.ratings.length>0} />
                </div>
                <div className="tour-rating-text">
                  <span>
                    {rating.toFixed(1)} ({tour.ratings.length} Ratings)
                  </span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="tour-title fw-5 underline custom_mb-5">
                  <Link href={`/it-details/${tour._id}`}>
                    {tour.title}
                  </Link>
                </h5>
              </div>
              <span className="tour-price b3">
                {currency}{" "}
                {convertedPrice !== null
                  ? convertedPrice.toFixed(2)
                  : tour.price.toLocaleString("en-US")}
              </span>
              <div className="tour-divider"></div>

              <div className="tour-meta d-flex align-items-center justify-content-between">
                {/* <div className="time d-flex align-items-center gap--5">
                  <i className="icon-heart"></i>
                  <span>{tour.duration}</span>
                </div> */}
                <div className="tour-btn">
                <button
                    onClick={handleToggleActivation}
                    className="bd-text-btn style-two"
                    type="button"
                    style={{
                      cursor: "pointer",
                      color: isDeactivated ? "grey" : "grey",
                    }}
                  >
                    {isDeactivated ?  "Activate" : "Deactivate"}
                    {/* <span className="icon__box">
                      <i className="fa-regular fa-arrow-right-long icon__first"></i>
                      <i className="fa-regular fa-arrow-right-long icon__second"></i>
                    </span> */}
                  </button>
                </div>

                <div className="tour-btn">
                {<button
                    onClick={() => handleToggleBooking(bookingState ? "Close" : "Open")} 
                    className="bd-text-btn style-two"
                    type="button"
                    style={{
                      color:  bookingState ? "red" : "blue"
                     }}
                  >
                   {bookingState ? "Close Booking" : "Open Booking"}
                    <span className="icon__box">
                    <i className="fa-regular fa-arrow-right-long icon__first"></i>
                    <i className="fa-regular fa-arrow-right-long icon__second"></i>
                    </span>
                  </button>}
                
                  <Modal
                    isOpen={isModalOpen2}
                    onRequestClose={() => setIsModalOpen2(false)}
                    contentLabel="Confirm Booking Action"
                    style={{
                      content: {
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "500px",
                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                      },
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                      },
                    }}
                  >
                    <h3>Confirm {modalAction} Booking</h3>
                    <p>Are you sure you want to {modalAction.toLowerCase()} booking for this Itinerary?</p>
                    <div style={{ display: "flex", marginTop: "20px" }}>
                      <button
                        onClick={confirmToggleBooking}
                        className="bd-primary-btn btn-style radius-60"
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setIsModalOpen2(false)}
                        className="bd-primary-btn btn-style radius-60"
                      >
                        No
                      </button>
                    </div>
                  </Modal>   

                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={tourWrapperClass}></div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Confirm Flag Activity"
        style={{
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '500px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
          }
        }}
      >
        <h3>{isDeactivated?"Confirm Activate Itinerary":"Confirm Deactivate Itinerary"}</h3>
        <p>Are you sure you want to toggle the Activation status?</p>
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <button
            onClick={confirmFlagActivity}
            className="bd-primary-btn btn-style radius-60"
            style={
                {
                    marginRight: '10px'
            }
        }
          >
            Yes
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bd-primary-btn btn-style radius-60"
          >
            No
          </button>
        </div>
      </Modal>
    </>
  );
};

export default TourSingleCard;
