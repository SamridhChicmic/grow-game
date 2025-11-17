import { useEffect, useRef } from "react";
import "./another.css";
export default function Another() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     // Stop the marquee after 3 seconds
  //     setTimeout(() => {
  //       if (marqueeRef.current) {
  //         marqueeRef.current.style.animation = "none";
  //       }
  //     }, 3000);
  //   }, []);

  return (
    <div className="scroll">
      <div className="m-scroll" ref={marqueeRef}>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">1</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">2</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">3</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">4</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">5</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">6</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">7</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">8</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">9</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">10</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">11</div>
        </span>
        <span>
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" /> */}
          <div className="w-16 h-16 bg-pink-600 rounded-sm">12</div>
        </span>
      </div>
    </div>
  );
}
