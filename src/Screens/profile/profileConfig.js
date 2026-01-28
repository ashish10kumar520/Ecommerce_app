import ProfileForm from "./forms/ProfileForm";
import AdressForm from "./forms/AdressForm";
import MyOrders from "./forms/MyOrders";
import GiftCards from "./forms/GiftCards";
import SavedCards from "./forms/SavedCards";
import SavedUpi from "./forms/SavedUpi";

export const profileConfig = [
  {
    section: "Orders",
    items: [
      {
        key: "myorders",
        label: "My Orders",
        component: MyOrders,
      },
    ],
  },
  {
    section: "Account Settings",
    items: [
      {
        key: "profile",
        label: "Profile Information",
        component: ProfileForm,
      },
      {
        key: "address",
        label: "Manage Addresses",
        component: AdressForm,
      },
    ],
  },
  {
    section: "Payments",
    items: [
      {
        key: "giftcards",
        label: "Gift Cards",
        component: GiftCards,
      },
      {
        key: "savedcards",
        label: "Saved Cards",
        component: SavedCards,
      },
      {
        key: "savedUPI",
        label: "Saved UPI",
        component: SavedUpi,
      },
    ],
  },
];
