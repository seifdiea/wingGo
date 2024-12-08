"use client";
import { fetchWishlist,removeFromWishlist } from "@/api/wishlistApi";
import { ProductsType } from "@/interFace/interFace";
import {Product} from "@/interFace/interFace";
import { cart_product, cart_wishlist_product } from "@/redux/slices/cartSlice";
import {
  decrease_wishlist_quantity,
  remove_wishlist_product,
  wishlist_product,
} from "@/redux/slices/wishlistSlice";
import { RootState } from "@/redux/store";
import CrossIcon from "@/svg/CrossIcon";
import MinusIcon from "@/svg/MinusIcon";
import PlusIcon from "@/svg/PlusIcon";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


const WishlistArea = () => {
  const route = useRouter();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const products = await fetchWishlist();
        setWishlistProducts(products);
      } catch (err) {
        setError("Failed to load wishlist products.");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  if (loading) {
    return <h3 className="text-center">Loading Wishlist...</h3>;
  }

  if (error) {
    return <h3 className="text-center">{error}</h3>;
  }



  const handleAddToCart = (product: ProductsType) => {

    
  };
  const handleIncressWishlist = (product: ProductsType) => {
   
  };
//frontend wise only- handle later
  const handDecressCart = (productId: string) => {
    setWishlistProducts((prevItems) =>
      prevItems.map((item) => {
        if (item.productId._id === productId) {
          console.log('Decreasing quantity for:', productId);
          return {
            ...item,
            productId: {
              ...item.productId,
              quantity: Math.max(item.productId.quantity - 1, 0),
            },
          };
        }
        console.log('Updated Wishlist:', wishlistProducts);
        return item;
      })
    );
  };
  
  

  const handleDelteProduct = (productId:string) => {
    const userconfirm= window.confirm(
      "Confirmation for deletion from wishlist"
    )
    if (userconfirm){
      setWishlistProducts((prevItems)=> prevItems.filter((item)=>item.productId._id!==productId))
    };
    removeFromWishlist(productId).then(()=>{
      console.log("Item removed from wishlist Successfullly")
    })
    .catch((error)=>{
      console.log("Error removing product from wishlist:", error);
      alert("Failed to remove item from wishlist, please try again.");
      setWishlistProducts((prevItems) => [
        ...prevItems,
        wishlistProducts.find((item) => item.productId.id === productId)!,
      ]);
    })
  };

  const handleChange = (e: any) => {};
  return (
    <>
      <div className="bd-wishlist-area section-space">
        <div className="container">
          {wishlistProducts?.length ? (
            <>
              {" "}
              <div className="row">
                <div className="col-xl-12">
                  <div className="bd-cart-list mb-45">
                    <table className="table">
                      <thead>
                        <tr>
                          <th colSpan={2} className="bd-cart-header-product">
                            Product
                          </th>
                          <th className="bd-cart-header-price">Price</th>
                          <th className="bd-cart-header-quantity">Quantity</th>
                          <th>Add to Cart</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishlistProducts?.map((item, index) => {
                          const totalAmount = item?.productId.price * item?.productId.quantity;
                          return (
                            <tr key={index}>
                              <td className="bd-cart-img image-hover-effect">
                                <Link href="/shop-details">
                                  {" "}
                                  <Image src={item?.picture} alt="image" />
                                </Link>
                              </td>

                              <td className="bd-cart-title">
                                <Link href="/shop-details">{item?.productId.name}</Link>
                              </td>

                              <td className="bd-cart-price">
                                <span>${totalAmount.toFixed(2)}</span>
                              </td>

                              <td className="bd-cart-quantity">
                                <div className="bd-product-quantity">
                                  <span
                                    className="bd-cart-minus"
                                    onClick={() => handDecressCart(item.productId._id)}
                                  >
                                    <MinusIcon />
                                  </span>
                                  <input
                                    className="bd-cart-input"
                                    type="text"
                                    onChange={handleChange}
                                    value={item.productId.quantity}
                                    readOnly
                                  />
                                  <span
                                    className="bd-cart-plus"
                                    onClick={() => handleIncressWishlist(item)}
                                  >
                                    <PlusIcon />
                                  </span>
                                </div>
                              </td>

                              <td className="bd-cart-add-to-cart">
                                <button
                                  type="submit"
                                  onClick={() => handleAddToCart(item)}
                                  className="bd-primary-btn btn-style is-bg radius-60"
                                >
                                  <span className="bd-primary-btn-text">
                                    Add To Cart
                                  </span>
                                  <span className="bd-primary-btn-circle"></span>
                                </button>
                              </td>

                              <td className="bd-cart-action">
                                <button
                                  className="bd-cart-action-btn"
                                  onClick={() => handleDelteProduct(item.productId._id)}
                                >
                                  <CrossIcon />
                                  <span className="ml-1">Remove</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="bd-cart-bottom">
                    <div className="row align-items-end">
                      <div className="col-xl-6 col-md-4">
                        <div className="bd-cart-update">
                          <Link
                            href="/cart"
                            className="bd-primary-btn btn-style has-arrow is-bg radius-60"
                          >
                            <span className="bd-primary-btn-arrow arrow-right">
                              <i className="fa-regular fa-arrow-right"></i>
                            </span>
                            <span className="bd-primary-btn-text">
                              Go To Cart
                            </span>
                            <span className="bd-primary-btn-circle"></span>
                            <span className="bd-primary-btn-arrow arrow-left">
                              <i className="fa-regular fa-arrow-right"></i>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {" "}
              <h3 className="text-center">No Wishlist Product Found</h3>{" "}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistArea;
