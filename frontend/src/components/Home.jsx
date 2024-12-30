import React, { useState } from 'react';
import carousel1 from '../images/kisang.png';
import carousel2 from '../images/2.png';

import about from '../images/video.mp4';
import applysteps from '../images/Steps.png';
import faq from '../images/faq3.png';
import { Link } from 'react-router-dom';

function Home() {
  const [open, setOpen] = useState(null);

  const handleToggle = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Carousel */}
      <div id="carouselExampleCaptions" className="relative">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button className="bg-gray-500 w-3 h-3 rounded-full active" aria-label="Slide 1"></button>
          <button className="bg-gray-500 w-3 h-3 rounded-full" aria-label="Slide 2"></button>
        </div>
        <div className="relative overflow-hidden">
          <img src={carousel1} className="w-full" alt="..." />
          <img src={carousel2} className="w-full hidden" alt="..." />
        </div>
        <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full">
          Prev
        </button>
        <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full">
          Next
        </button>
      </div>

      {/* About Section */}
      <section id="about" className="flex flex-col items-center bg-gray-100 p-8 shadow-lg rounded-lg mt-8">
        <p className="text-lg text-gray-800 mb-4 text-center">
          Welcome to E-yojana, your one-stop destination for discovering and applying for government schemes tailored to your needs.
        </p>
        <p className="text-lg text-gray-800 mb-4 text-center">
          E-Yojana is here to help you take full advantage of the resources and support available to you.
        </p>
        <div className="space-x-4">
          <Link to="/category">
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Find Schemes</button>
          </Link>
          <Link to="/adminhome" className="text-green-600 hover:text-green-700">
            Admin
          </Link>
        </div>
      </section>

      {/* Apply Steps Section */}
      <section>
        <img src={applysteps} className="w-full" alt="Apply Steps" />
        <div className="flex justify-center mt-8">
          <video className="border-2 border-gray-600 rounded-lg shadow-md max-w-full" controls>
            <source src={about} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="flex flex-col items-center mt-8">
        <div className="flex flex-col md:flex-row items-center">
          <img src={faq} className="max-w-md mb-4 md:mb-0 md:mr-8" alt="FAQ" />
          <div className="space-y-4 max-w-md">
            <h4 className="text-2xl font-bold">Frequently Asked Questions</h4>
            <div>
              <button className="flex justify-between w-full bg-gray-200 p-4 rounded-md" onClick={() => handleToggle(0)}>
                What is Eyojana? 
                <span className={open === 0 ? "rotate-90 transform" : ""}>→</span>
              </button>
              {open === 0 && <p className="mt-2 text-gray-600">Eyojana is a platform where you can find and apply for government schemes.</p>}
            </div>
            {/* Repeat for other FAQs */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 p-8">
        <div className="flex flex-col md:flex-row justify-around space-y-4 md:space-y-0">
          <div>
            <h4 className="text-white mb-2">Powered By</h4>
            <p>Government Of India</p>
          </div>
          <div>
            <h4 className="text-white mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-green-400">Home</Link></li>
              <li><Link to="/category" className="hover:text-green-400">Schemes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-2">Contact Us</h4>
            <p>Email: info@eyojana.gov</p>
          </div>
        </div>
        <p className="text-center mt-4 border-t border-gray-600 pt-4">© 2024 E-Yojana. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
