import ProfileForm from "./forms/ProfileForm";
import AdressForm from "./forms/AdressForm";
import MyOrders from "./forms/MyOrders";
import WishList from "./forms/WishList";
import Notifications from "./forms/Notifications";
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
        key: "wishlist",
        label: "WishList",
        component: WishList,
      },
      {
        key: "notifications",
        label: "Stock Notifications",
        component: Notifications,
      },
      {
        key: "savedUPI",
        label: "Saved UPI",
        component: SavedUpi,
      },
    ],
  },
];
