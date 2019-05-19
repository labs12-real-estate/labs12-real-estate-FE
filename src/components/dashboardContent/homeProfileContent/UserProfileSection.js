import React from 'react';
import UserPlaceholder from 'assets/icons/UserPlaceholder';
import { connect } from 'react-redux';

function UserProfileSection({ house, user, profilePhotoURL }) {
  return (
    <div className="house_profile_user_section_container">
      <div className="house_profile_name_and_address">
        <div className="house_profile_user_section_sub_container">
          <figure>
            <div className="camera-overlay">
              <i class="fas fa-camera" />
            </div>
            {false ? <img src={profilePhotoURL} alt="user" /> : <UserPlaceholder />}
          </figure>
          <div className="name_address">
            <h1>{user.name}</h1>
            <h3>
              <i className="fas fa-map-marker-alt" />
              {house.address}
            </h3>
          </div>
        </div>
        <div className="house_profile_user_section_sub_container small_home_address">
          <h1>{user.name}</h1>
          <figure>{false ? <img src={profilePhotoURL} alt="user" /> : <UserPlaceholder />}</figure>
          <h3>{house.address}</h3>
        </div>
      </div>
      <div className="house_profile_user_section_sub_container small_email_share">
        <span className="house_profile_links house_profile_left_padding">
          <span>
            <i className="far fa-envelope" />
            {user.email}
          </span>
        </span>
        <div className="house_profile_links house_profile_features">
          <span>
            <i className="fas fa-print" /> Print house profile
          </span>
          <span>
            <i className="fas fa-file-pdf" /> Export as PDF
          </span>
          <span>
            <i className="fas fa-share" /> Share public link
          </span>
          <span>
            <i className="fas fa-file-csv" /> Export as CSV
          </span>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ houseReducer, authReducer, storageReducer }) => {
  return {
    user: authReducer.user,
    house: houseReducer.house,
    profilePhotoURL: storageReducer.photoURLs.profile
  };
};

export default connect(
  mapStateToProps,
  {}
)(UserProfileSection);
