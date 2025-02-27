import React from "react";
import { saveReferaltoFirebase } from "../config/config";
import FacebookIcon from '../assets/icons/facebook.png';
import TwitterIcon from '../assets/icons/twitter.png';
import WhatsAppIcon from '../assets/icons/whatsapp.png';
// import { ReactComponent as FacebookIcon } from '../assets/icons/facebook.svg';
// import { ReactComponent as TwitterIcon } from '../assets/icons/twitter.svg';
// import { ReactComponent as WhatsAppIcon } from '../assets/icons/whatsapp.svg';

interface ReferralLinkShareProps {
  userId:string;
  referralLink: string;
  websiteUrl: string;
}

const ReferralLinkShare: React.FC<ReferralLinkShareProps> = ({ userId,referralLink, websiteUrl }) => {
  const encodedReferralLink = encodeURIComponent(referralLink);
  const encodedWebsiteUrl = encodeURIComponent(websiteUrl);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedWebsiteUrl}&quote=Check%20this%20out!%20I%20found%20this%20amazing%20app%20and%20here's%20my%20referral%20link%3A%20${encodedReferralLink}`;
  
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedWebsiteUrl}&text=Check%20this%20out!%20I%20found%20this%20amazing%20app%20and%20here's%20my%20referral%20link%3A%20${encodedReferralLink}`;

  const whatsappUrl = `https://wa.me/?text=Check%20this%20out!%20I%20found%20this%20amazing%20app%20and%20here's%20my%20referral%20link%3A%20${encodedReferralLink}%20Check%20out%20this%20website%20too%20at%3A%20${encodedWebsiteUrl+'?referralCode='+encodedReferralLink}`;

  const waHandleclick = ()=>{
    window.open(whatsappUrl, "_blank");
    saveReferaltoFirebase(userId, referralLink);

  };

  return (
    <div className="flex justify-center items-center gap-4 px-8 py-4 bg-darkwine rounded-3xl">

      
      <button 
        onClick={() => window.open(facebookUrl, "_blank")} 
        className=" flex items-center justify-center px-4 rounded-lg"
      >
        <img src={FacebookIcon} className="w-10"/>
      </button>
      <button 
        onClick={() => window.open(twitterUrl, "_blank")}
        className=" flex items-center justify-center px-4 py-1 rounded-lg"
      >
        <img src={TwitterIcon} className="w-10" />
      </button>
      <button 
        onClick={waHandleclick}
        className=" flex items-center justify-center px-4 rounded-lg"
      >
        <img src={WhatsAppIcon} className="w-10"/>
      </button>
    </div>
  );
};

export default ReferralLinkShare;
