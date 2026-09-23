import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Overview from "@/components/Overview";
import Stats from "@/components/Stats";
import Datasets from "@/components/Datasets";
import DeveloperApi from "@/components/DeveloperApi";
import CustomData from "@/components/CustomData";
import Pricing from "@/components/Pricing";
import OrderForm from "@/components/OrderForm";
import WhyUs from "@/components/WhyUs";
import Customers from "@/components/Customers";
import FinalCta from "@/components/FinalCta";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <Stats />
        <Datasets />
        <DeveloperApi />
        <CustomData />
        <Pricing />
        <OrderForm />
        <WhyUs />
        <Customers />
        <FinalCta />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
