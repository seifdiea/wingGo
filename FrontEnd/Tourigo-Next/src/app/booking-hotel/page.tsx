"use client";

import BookingHotelMain from "@/components/booking-hotel/BookingHotelMain";
import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/layout/DefaultWrapper";
import React from "react";

const page = () => {
  
  return (
    <>
      <MetaData pageTitle="Booking">
        <Wrapper>
          <main>
            <BookingHotelMain  />
          </main>
        </Wrapper>
      </MetaData>
    </>
  );
};

export default page;