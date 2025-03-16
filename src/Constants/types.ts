// Represents a color with RGBA values
interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
  }
  
  // Represents the logo object
  interface Logo {
    accessType: string;
    name: string;
    path: string;
    type: string;
  }
  
  // Represents an individual discount
  interface Discount {
    id: string;
    type: string;
    amount: number;
    strategy: string;
  }
  
  // Represents the promo details
  interface Promo {
    id: string;
    name: string;
    description: string;
    isNew: boolean | null;
    slug: string;
    code: string;
    exclusive: boolean;
    showEndDate: boolean;
    futures: boolean;
    endDate: string; // ISO date string
    extraAccountPromo: boolean;
    positionRankAll: string;
    positionRankExclusive: string;
    positionRankExtra: string;
    discounts: Discount[];
  }
  
  // Represents the preferred promo wrapper
  interface PreferredPromo {
    id: string;
    promo: Promo;
  }
  
  // Represents an icon for a platform
  interface Icon {
    accessType: string;
    name: string;
    path: string;
    type: string;
  }
  
  // Represents a firm platform
  interface FirmPlatform {
    id: string;
    name: string;
    icon: Icon;
  }
  
  // Main interface representing the prop firm
 export interface Firm {
    id: string;
    slug: string;
    name: string;
    logo: Logo;
    logoAltText: string;
    logoBackgroundColor: Color;
    country: string;
    currency: string;
    rank: number;
    reviewScore: number;
    reviewsCount: number;
    likesCount: number;
    maxAllocation: number;
    programType: string[];
    accountSize: string;
    dateEstablished: string; // ISO date string
    assetFxEnabled: boolean;
    assetEnergyEnabled: boolean;
    assetCryptoEnabled: boolean;
    assetFuturesEnabled: boolean | null;
    assetMetalsEnabled: boolean;
    assetStocksEnabled: boolean;
    assetIndicesEnabled: boolean;
    assetOtherCommoditiesEnabled: boolean;
    trustPilotScore: number;
    popularityScore: number | null;
    bestSellerAllWeekly: boolean;
    bestSellerAllMonthly: boolean;
    bestSellerCrypto: boolean | null;
    bestSellerFutures: boolean | null;
    preferredPromo: PreferredPromo;
    userLikes: unknown | null;
    firmPlatforms: FirmPlatform[];
  }
  

//////////////////////////////////////////////
interface PromoReference {
    id: string;
    name: string;
  }
  
  // Discount within a promo
  interface ChallengeDiscount {
    id: string;
    type: string;
    amount: number;
    enabled: number;
    strategy: string;
  }
  

interface ChallengePromoDetail {
    id: string;
    name: string;
    discounts: ChallengeDiscount[];
  }
  
  // Challenge promo wrapper
  interface ChallengePromo {
    id: string;
    promo: ChallengePromoDetail[];
  }

interface ChallengeFirm {
    id: string;
    name: string;
    slug: string;
    logo: Logo;
    logoBackgroundColor: Color;
    logoAltText: string;
    rank: number;
    reviewScore: number;
    reviewsCount: number;
    currency: string;
  }

export interface Challenge {
    id: string;
    name: string;
    accountSize: number;
    steps: string;
    profitTargetSum: number;
    profitSplit: number;
    payoutFrequency: Number | null;
    payoutFrequencyDescription: string;
    loyaltyPoints: number;
    maxDrawdown: number;
    price: number;
    sortingPrice: number;
    discountedPrice: number | null;
    phase1ProfitTarget: number;
    phase2ProfitTarget: number;
    phase3ProfitTarget: number | null;
    phase4ProfitTarget: number | null;
    phase1ProfitTargetAmount: number | null;
    phase2ProfitTargetAmount: number | null;
    phase3ProfitTargetAmount: number | null;
    phase4ProfitTargetAmount: number | null;
    phase1MaxDailyLoss: number;
    phase2MaxDailyLoss: number;
    phase3MaxDailyLoss: number | null;
    phase4MaxDailyLoss: number | null;
    phase1MaxDailyLossAmount: number | null;
    phase2MaxDailyLossAmount: number | null;
    phase3MaxDailyLossAmount: number | null;
    phase4MaxDailyLossAmount: number | null;
    phase1MaxDrawdown: number;
    phase2MaxDrawdown: number;
    phase3MaxDrawdown: number | null;
    phase4MaxDrawdown: number | null;
    phase1MaxDrawdownAmount: number | null;
    phase2MaxDrawdownAmount: number | null;
    phase3MaxDrawdownAmount: number | null;
    phase4MaxDrawdownAmount: number | null;
    maxDailyLoss: number;
    firm: ChallengeFirm;
    isBookmarked: boolean;
    promos: PromoReference[];
    challengePromos: ChallengePromo[];
  }