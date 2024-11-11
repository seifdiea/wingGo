"use client"
import React, {useState, useEffect} from "react";
import ProfileDetails from './ProfileDetails';

import PendingUsers from './PendingUsers';
import { fetchUsername } from "@/api/adminApi";
import { set } from "date-fns";
import Prefrences from "./Prefrences";


interface ProfileDetailsProps {
  id: string;
}

const ProfileTabs: React.FC<ProfileDetailsProps> = ({ id }) => {

  

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState<any>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await fetchUsername();
        console.log('Profile data:', data);
        setProfileData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    

    fetchProfileData();
    setRefresh(false);
    console.log('Refresh:', refresh);
  }, [id, refresh]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pending users':
        return <PendingUsers />;
      case 'profile':
        return <ProfileDetails profileData={profileData} id={id}/>;
      
      default:
        return null;
    }
  };

  return (
    <>
      <section className="faq__area section-space-bottom faq__style-6 p-relative z-index-1 fix">
        <div className="container">
          <div
            className="row align-items-center justify-content-center wow bdFadeInUp"
            data-wow-delay=".3s"
          >
            
          </div>
          <div className="row gy-24">
            <div className="col-xxl-3 col-xl-3 col-lg-3 mt-125">
              <div
                className="accordion-wrapper mb-35 wow bdFadeInUp"
                data-wow-delay=".3s"
                data-wow-duration="1s"
              >
                <div className="faq-tab accordion-wrapper faq-style-2">
                  <nav>
                    <div
                      className="nav nav-tabs flex-column"
                      id="nav-tab-2"
                      role="tablist"
                    >
                      <button
                        className="nav-link active"
                        id="nav-general-2-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-general-2"
                        type="button"
                        role="tab"
                        aria-controls="nav-general-2"
                        aria-selected="false"
                        onClick={() => setActiveTab('profile')}
                      >
                        <span>
                        <i className="icon-profile"></i>
                        </span>
                        Profile
                      </button>
                      <button
                        className="nav-link"
                        id="nav-community-2-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-community-2"
                        type="button"
                        role="tab"
                        aria-controls="nav-community-2"
                        aria-selected="false"
                        onClick={() => setActiveTab('pending users')}
                      >
                        <span>
                        <i className="icon-doc"></i>
                        </span>
                        Pending Users
                      </button>
                      
                      
                    </div>
                  </nav>
                </div>
              </div>
            </div>
            <div className="tab-content" style={{ marginLeft: '20px', flex: 1 }}>
                {renderTabContent()}
              </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileTabs;
