import Navbar from "../components/navbar"
import DeliveryList from "../components/delivery-list";

export default function RootLayout({ children }) {
  return (
      <div className="main">
        <Navbar />
        <DeliveryList />
        </div>
  )
}