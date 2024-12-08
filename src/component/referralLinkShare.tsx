import React from "react";
import { ReactComponent as FacebookIcon } from '../assets/icons/facebook.svg';
import { ReactComponent as TwitterIcon } from '../assets/icons/twitter.svg';
import { ReactComponent as WhatsAppIcon } from '../assets/icons/whatsapp.svg';

interface ReferralLinkShareProps {
  referralLink: string;
  websiteUrl: string;
}

const ReferralLinkShare: React.FC<ReferralLinkShareProps> = ({ referralLink, websiteUrl }) => {
  const encodedReferralLink = encodeURIComponent(referralLink);
  const encodedWebsiteUrl = encodeURIComponent(websiteUrl);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedWebsiteUrl}&quote=Check%20this%20out!%20I%20found%20this%20amazing%20app%20and%20here's%20my%20referral%20link%3A%20${encodedReferralLink}`;
  
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedWebsiteUrl}&text=Check%20this%20out!%20I%20found%20this%20amazing%20app%20and%20here's%20my%20referral%20link%3A%20${encodedReferralLink}`;

  const whatsappUrl = `https://wa.me/?text=Check%20this%20out!%20I%20found%20this%20amazing%20app%20and%20here's%20my%20referral%20link%3A%20${encodedReferralLink}%20Check%20out%20this%20website%20too%20at%3A%20${encodedWebsiteUrl}`;

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <button 
        onClick={() => window.open(facebookUrl, "_blank")} 
        className="bg-goldenYellow flex items-center justify-center px-4 rounded-lg"
      >
        <FacebookIcon width={30} height={30} /> 
        <div>Share on Facebook</div>
      </button>
      <button 
        onClick={() => window.open(twitterUrl, "_blank")}
        className="bg-goldenYellow flex items-center justify-center px-4 py-1 rounded-lg"
      >
        <TwitterIcon width={20} height={20} /> 
        <div className="ml-2">Share on Twitter</div>
      </button>
      <button 
        onClick={() => window.open(whatsappUrl, "_blank")}
        className="bg-goldenYellow flex items-center justify-center px-4 rounded-lg"
      >
        <WhatsAppIcon width={30} height={30} /> 
        <div>Share on Whatsapp</div>
      </button>
    </div>
  );
};

export default ReferralLinkShare;
