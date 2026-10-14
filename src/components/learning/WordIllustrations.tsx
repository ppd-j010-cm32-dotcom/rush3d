import React from 'react';

interface WordIllustrationProps {
  name: string;
  className?: string;
}

export const WordIllustration: React.FC<WordIllustrationProps> = ({ name, className = 'w-44 h-44' }) => {
  const normalized = name.toLowerCase().trim();

  switch (normalized) {
    case 'buku':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#E0F2FE" />
          <path d="M40 135C65 125 100 128 100 150C100 128 135 125 160 135V55C135 45 100 48 100 70C100 48 65 45 40 55V135Z" fill="#38BDF8" />
          <path d="M40 135C65 125 100 128 100 150V70C100 48 65 45 40 55V135Z" fill="#0284C7" />
          <path d="M100 150C100 128 135 125 160 135V55C135 45 100 48 100 70V150Z" fill="#BAE6FD" />
          <line x1="55" y1="75" x2="85" y2="72" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <line x1="55" y1="95" x2="85" y2="92" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <line x1="115" y1="72" x2="145" y2="75" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          <line x1="115" y1="92" x2="145" y2="95" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="150" r="4" fill="#0369A1" />
        </svg>
      );

    case 'bola':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#FEF3C7" />
          <circle cx="100" cy="100" r="60" fill="#F8FAFC" stroke="#0F172A" strokeWidth="6" />
          {/* Soccer ball pentagons */}
          <polygon points="100,75 118,88 111,109 89,109 82,88" fill="#1E293B" />
          <path d="M100 75L100 45" stroke="#0F172A" strokeWidth="5" />
          <path d="M118 88L148 76" stroke="#0F172A" strokeWidth="5" />
          <path d="M111 109L135 135" stroke="#0F172A" strokeWidth="5" />
          <path d="M89 109L65 135" stroke="#0F172A" strokeWidth="5" />
          <path d="M82 88L52 76" stroke="#0F172A" strokeWidth="5" />
          <circle cx="85" cy="70" r="6" fill="#FDE047" />
        </svg>
      );

    case 'mata':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#F3E8FF" />
          {/* Pair of friendly cartoon eyes */}
          <ellipse cx="65" cy="100" rx="30" ry="38" fill="#FFFFFF" stroke="#6B21A8" strokeWidth="5" />
          <circle cx="65" cy="100" r="16" fill="#3B82F6" />
          <circle cx="65" cy="100" r="9" fill="#0F172A" />
          <circle cx="70" cy="94" r="5" fill="#FFFFFF" />

          <ellipse cx="135" cy="100" rx="30" ry="38" fill="#FFFFFF" stroke="#6B21A8" strokeWidth="5" />
          <circle cx="135" cy="100" r="16" fill="#3B82F6" />
          <circle cx="135" cy="100" r="9" fill="#0F172A" />
          <circle cx="140" cy="94" r="5" fill="#FFFFFF" />

          {/* Eyelashes / Eyebrows */}
          <path d="M42 55C55 50 75 52 88 62" stroke="#6B21A8" strokeWidth="5" strokeLinecap="round" />
          <path d="M112 62C125 52 145 50 158 55" stroke="#6B21A8" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    case 'baju':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#DCFCE7" />
          <path
            d="M70 45L100 65L130 45L165 75L145 100L130 90V160H70V90L55 100L35 75L70 45Z"
            fill="#10B981"
            stroke="#065F46"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Collar & Buttons */}
          <path d="M70 45L100 65L130 45" fill="#A7F3D0" stroke="#065F46" strokeWidth="4" />
          <circle cx="100" cy="90" r="4" fill="#FFFFFF" stroke="#065F46" strokeWidth="2" />
          <circle cx="100" cy="115" r="4" fill="#FFFFFF" stroke="#065F46" strokeWidth="2" />
          <circle cx="100" cy="140" r="4" fill="#FFFFFF" stroke="#065F46" strokeWidth="2" />
        </svg>
      );

    case 'kaki':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#FEF3C7" />
          <path
            d="M80 40V120C80 135 70 145 50 145H40C40 155 50 165 65 165H125C145 165 155 150 155 135C155 125 145 120 135 120H110V40H80Z"
            fill="#F59E0B"
            stroke="#92400E"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Toes details */}
          <circle cx="140" cy="145" r="8" fill="#FDE68A" />
          <circle cx="120" cy="145" r="7" fill="#FDE68A" />
        </svg>
      );

    case 'susu':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#E0F2FE" />
          {/* Milk carton */}
          <path d="M75 55L100 35L125 55H75Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="4" />
          <rect x="65" y="55" width="70" height="105" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="5" />
          <rect x="65" y="80" width="70" height="35" fill="#38BDF8" />
          <text x="100" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold">
            SUSU
          </text>
          {/* Glass of milk */}
          <path d="M125 120L130 160H155L160 120H125Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
        </svg>
      );

    case 'kereta':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#FFF7ED" />
          {/* Ground shadow */}
          <ellipse cx="105" cy="155" rx="75" ry="12" fill="#0F172A" opacity="0.4" />
          {/* Supercar Rear GT Wing with Orange Endplates */}
          <path d="M42 98L62 97" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          <polygon points="38,92 48,90 48,104 38,102" fill="#EA580C" stroke="#9A3412" strokeWidth="1.5" />
          <rect x="44" y="93" width="18" height="4" rx="2" fill="#0F172A" />

          {/* Supercar Main Body (Aerodynamic low-slung curves) */}
          <path
            d="M28 135C30 120 42 110 58 110C68 110 74 114 82 118C92 104 108 92 135 92C154 92 168 100 178 118C184 122 188 128 188 136C188 142 182 144 172 144H38C30 144 28 140 28 135Z"
            fill="#F97316"
            stroke="#C2410C"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Deep Sculpted Side Air Intake Scoop (black cavity) */}
          <path d="M68 118C74 120 78 126 80 138H68C66 128 65 122 68 118Z" fill="#18181B" stroke="#0F172A" strokeWidth="2" />

          {/* Curved Cockpit Canopy (Dark Glass) */}
          <path
            d="M85 116C95 102 110 95 132 95C148 95 158 102 166 116C152 114 135 112 115 112C98 112 88 114 85 116Z"
            fill="#0F172A"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
          {/* Glass glare highlight */}
          <path d="M98 108C108 100 122 98 135 98" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

          {/* Front Hood Black Sunken Air Extractor Scoops */}
          <polygon points="144,116 160,116 164,122 146,122" fill="#18181B" />
          <polygon points="166,118 178,118 181,123 168,123" fill="#18181B" />

          {/* Swept-back Almond Headlights */}
          <ellipse cx="170" cy="126" rx="9" ry="5" transform="rotate(-15 170 126)" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="170" cy="126" r="3" fill="#38BDF8" />

          {/* Front Carbon Splitter & Side Skirt */}
          <rect x="35" y="142" width="148" height="4.5" rx="2" fill="#0F172A" />

          {/* Wheels (Alloy multi-spoke with orange inner ring) */}
          <g>
            {/* Rear Wheel */}
            <circle cx="58" cy="138" r="16" fill="#18181B" stroke="#0F172A" strokeWidth="3" />
            <circle cx="58" cy="138" r="11" fill="#EA580C" />
            <circle cx="58" cy="138" r="8" fill="#E2E8F0" />
            <circle cx="58" cy="138" r="3" fill="#0F172A" />

            {/* Front Wheel */}
            <circle cx="152" cy="138" r="16" fill="#18181B" stroke="#0F172A" strokeWidth="3" />
            <circle cx="152" cy="138" r="11" fill="#EA580C" />
            <circle cx="152" cy="138" r="8" fill="#E2E8F0" />
            <circle cx="152" cy="138" r="3" fill="#0F172A" />
          </g>
        </svg>
      );

    case 'kelapa':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#DCFCE7" />
          <circle cx="100" cy="110" r="55" fill="#22C55E" stroke="#15803D" strokeWidth="5" />
          <path d="M90 55C90 40 100 35 105 35" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="100" cy="65" rx="15" ry="8" fill="#166534" />
          {/* Palm leaves accent */}
          <path d="M100 55C125 45 150 50 165 65" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
          <path d="M100 55C75 45 50 50 35 65" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
          {/* Coconut straw */}
          <line x1="100" y1="90" x2="125" y2="60" stroke="#F43F5E" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'kamera':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#F1F5F9" />
          <rect x="35" y="70" width="130" height="85" rx="16" fill="#334155" stroke="#0F172A" strokeWidth="5" />
          <rect x="55" y="55" width="40" height="15" rx="4" fill="#64748B" />
          {/* Flash */}
          <rect x="135" y="58" width="18" height="10" rx="2" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          {/* Lens */}
          <circle cx="100" cy="112" r="32" fill="#0F172A" stroke="#94A3B8" strokeWidth="6" />
          <circle cx="100" cy="112" r="20" fill="#2563EB" />
          <circle cx="94" cy="106" r="6" fill="#FFFFFF" />
        </svg>
      );

    case 'kasut':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#EFF6FF" />
          <path
            d="M40 100L70 85L95 110L145 115C160 115 170 125 170 140H30C30 120 35 105 40 100Z"
            fill="#3B82F6"
            stroke="#1D4ED8"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Sole */}
          <rect x="25" y="140" width="150" height="18" rx="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
          {/* Shoe laces */}
          <line x1="75" y1="95" x2="90" y2="105" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <line x1="85" y1="105" x2="100" y2="115" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'sabun':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#ECFDF5" />
          {/* Soap bar */}
          <rect x="45" y="85" width="110" height="60" rx="24" fill="#34D399" stroke="#059669" strokeWidth="5" />
          <rect x="58" y="96" width="84" height="38" rx="16" fill="#6EE7B7" />
          {/* Soap bubbles */}
          <circle cx="145" cy="65" r="18" fill="#A7F3D0" stroke="#059669" strokeWidth="3" opacity="0.8" />
          <circle cx="140" cy="60" r="4" fill="#FFFFFF" />
          <circle cx="120" cy="50" r="10" fill="#A7F3D0" stroke="#059669" strokeWidth="2" opacity="0.8" />
          <circle cx="60" cy="68" r="12" fill="#A7F3D0" stroke="#059669" strokeWidth="2" opacity="0.8" />
        </svg>
      );

    case 'katak':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#F0FDF4" />
          {/* Frog eyes */}
          <circle cx="65" cy="70" r="22" fill="#22C55E" stroke="#166534" strokeWidth="4" />
          <circle cx="65" cy="70" r="12" fill="#FFFFFF" />
          <circle cx="67" cy="70" r="6" fill="#0F172A" />

          <circle cx="135" cy="70" r="22" fill="#22C55E" stroke="#166534" strokeWidth="4" />
          <circle cx="135" cy="70" r="12" fill="#FFFFFF" />
          <circle cx="133" cy="70" r="6" fill="#0F172A" />

          {/* Body */}
          <ellipse cx="100" cy="115" rx="55" ry="40" fill="#4ADE80" stroke="#166534" strokeWidth="5" />
          {/* Big happy mouth */}
          <path d="M70 120C85 135 115 135 130 120" stroke="#166534" strokeWidth="5" strokeLinecap="round" />
          {/* Rosy cheeks */}
          <circle cx="65" cy="118" r="7" fill="#F87171" opacity="0.6" />
          <circle cx="135" cy="118" r="7" fill="#F87171" opacity="0.6" />
        </svg>
      );

    case 'lampu':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#FEFCE8" />
          {/* Lampshade */}
          <polygon points="60,110 140,110 125,60 75,60" fill="#FBBF24" stroke="#B45309" strokeWidth="5" />
          {/* Stand */}
          <rect x="95" y="110" width="10" height="45" fill="#78350F" />
          <ellipse cx="100" cy="155" rx="35" ry="10" fill="#78350F" />
          {/* Light rays */}
          <path d="M45 130L30 145" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <path d="M155 130L170 145" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <path d="M100 45V30" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'pintu':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#F5F3FF" />
          {/* Frame */}
          <rect x="50" y="35" width="100" height="135" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="5" />
          {/* Door leaf */}
          <rect x="58" y="43" width="84" height="127" fill="#8B5CF6" />
          {/* Panels */}
          <rect x="68" y="55" width="64" height="45" fill="#7C3AED" rx="4" />
          <rect x="68" y="110" width="64" height="50" fill="#7C3AED" rx="4" />
          {/* Doorknob */}
          <circle cx="122" cy="108" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
        </svg>
      );

    case 'cantumkan':
    case 'cantum':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#FEE2E2" />
          {/* Puzzle pieces connecting */}
          <rect x="40" y="60" width="55" height="55" rx="6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="4" />
          <rect x="105" y="60" width="55" height="55" rx="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="4" />
          {/* Connector tab */}
          <circle cx="95" cy="87" r="12" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
          {/* Action arrows pointing together */}
          <path d="M45 140H85M85 140L75 130M85 140L75 150" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
          <path d="M155 140H115M115 140L125 130M115 140L125 150" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    case 'tampalkan':
    case 'tampal':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#FEF3C7" />
          {/* Book / paper sheet */}
          <rect x="45" y="40" width="110" height="130" rx="8" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="4" />
          {/* Sticker star being pasted */}
          <polygon
            points="100,75 110,95 132,98 116,113 120,135 100,123 80,135 84,113 68,98 90,95"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="3"
          />
          {/* Hand finger pressing */}
          <path d="M125 110L145 130" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    case 'kumpulkan':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#EDE9FE" />
          {/* Trophy & stars */}
          <path
            d="M70 60H130V95C130 115 115 125 100 125C85 125 70 115 70 95V60Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="4"
          />
          <path d="M100 125V145M80 145H120" stroke="#B45309" strokeWidth="5" strokeLinecap="round" />
          <circle cx="50" cy="70" r="10" fill="#F43F5E" />
          <circle cx="150" cy="70" r="10" fill="#3B82F6" />
          <circle cx="100" cy="85" r="8" fill="#FFFFFF" />
        </svg>
      );

    default:
      // Generic friendly reading badge
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="24" fill="#E0F2FE" />
          <circle cx="100" cy="100" r="60" fill="#38BDF8" stroke="#0284C7" strokeWidth="6" />
          <path d="M80 100L95 115L125 85" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};
