//ShopMain.tsx
"use client";
import React from "react";
import Breadcrumb from "../common/breadcrumb/BreadCrumb";
// import getProductData from "@/data/prod-data";
import PaginationWrapperTwo from "../shearedComponents/PaginationWrapperTwo";
import ShopSidebarMain from "./ShopSidebarMain";
import ShopModal from "@/elements/modals/ShopModalproduct";
import ShopContentSingleCard from "@/elements/Products/ShopContentSingleCard";
import ShopContentHeader from "@/elements/Products/ShopContentHeader";
import { useProductSearch } from "@/hooks/newProductSearch";
import { useFilter } from "@/hooks/useFilterproduct";

const ShopMain = () => {
  const filterData = useFilter(0, 18);
  const searchData = useProductSearch();
  
  const mapData = searchData?.length ? searchData : filterData;
  return (
    <>
      <Breadcrumb titleOne="Shop" titleTwo="Shop" />
      <section className="bd-shop-area section-space">
        <div className="container">
          <div className="row gy-24">
            {mapData?.length ? (
              <>
                <div className="col-xxl-8 col-xl-8 col-lg-12">
                  <ShopContentHeader />
                  <div className="row gy-24">
                    {mapData.map((item, index) => (
                      <ShopContentSingleCard
                        classItem="col-xxl-4 col-xl-4 col-lg4 col-md-4 col-sm-6"
                        key={index}
                        item={item}
                        userRole="Tourist"
                      />
                    ))}
                  </div>
                  <PaginationWrapperTwo />
                </div>
              </>
            ) : (
              <>
                <div className="col-xxl-8 col-xl-8 col-lg-12">
                  <h2 className="text-center">No Product Found</h2>
                </div>
              </>
            )}
            <div className="col-xxl-4 col-xl-4 col-lg-6">
              <ShopSidebarMain />
            </div>
          </div>
        </div>
      </section>
      <ShopModal />
    </>
  );
};

export default ShopMain;
