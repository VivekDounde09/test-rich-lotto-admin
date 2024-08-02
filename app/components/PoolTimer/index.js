// import React, { useState, useEffect } from 'react';
// import { PropTypes } from 'prop-types';

// function PoolTimer({ initialTime }) {
//   const [timeRemaining, setTimeRemaining] = useState(initialTime);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setTimeRemaining((prevTime) => {
//         if (prevTime <= 0) {
//           clearTimeout(timer);
//           return 0;
//         }
//         return prevTime - 1000;
//       });
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [timeRemaining]);

//   function millisecondsToHMS(milliseconds) {
//     var seconds = Math.floor(milliseconds / 1000);
//     var h = Math.floor(seconds / 3600);
//     var m = Math.floor((seconds % 3600) / 60);
//     var s = seconds % 60;

//     if (h >= 24) {
//       var d = Math.floor(h / 24);
//       h = h % 24;
//       return (
//         <>
//           <div className="flex justify-center items-center gap-4">
//             <div className="flex flex-col items-center gap-2">
//               <span className="text-16 lg:text-[24px] text-primary-300">
//                 {d < 10 ? '0' + d : d}
//               </span>
//               <span className="text-16 lg:text-20 text-primary-300">
//                 {d > 1 ? 'DAYS' : 'DAY'}
//               </span>
//             </div>
//             <div className="flex flex-col items-center gap-2">
//               <span className="text-16 lg:text-[24px] text-primary-300">
//                 {h < 10 ? '0' + h : h}
//               </span>
//               <span className="text-16 lg:text-20 text-primary-300">
//                 {h > 1 ? 'HOURS' : 'HOUR'}
//               </span>
//             </div>
//             <div className="flex flex-col items-center gap-2">
//               <span className="text-16 lg:text-[24px] text-primary-300">
//                 {m < 10 ? '0' + m : m}
//               </span>
//               <span className="text-16 lg:text-20 text-primary-300">MIN</span>
//             </div>
//           </div>
//         </>
//       );
//     } else {
//       var hDisplay = h < 10 ? '0' + h : h;
//       var mDisplay = m < 10 ? '0' + m : m;
//       var sDisplay = s < 10 ? '0' + s : s;

//       return (
//         <>
//           <div className="flex justify-center items-center gap-4">
//             <div className="flex flex-col items-center gap-2">
//               <span className="text-16 lg:text-[24px] text-primary-300">
//                 {hDisplay}
//               </span>
//               <span className="text-16 lg:text-20 text-primary-300">HOURS</span>
//             </div>
//             <div className="flex flex-col items-center gap-2">
//               <span className="text-16 lg:text-[24px] text-primary-300">
//                 {mDisplay}
//               </span>
//               <span className="text-16 lg:text-20 text-primary-300">MIN</span>
//             </div>
//             <div className="flex flex-col items-center gap-2">
//               <span className="text-16 lg:text-[24px] text-primary-300">
//                 {sDisplay}
//               </span>
//               <span className="text-16 lg:text-20 text-primary-300">SEC</span>
//             </div>
//           </div>
//         </>
//       );
//     }
//   }

//   return <span>{millisecondsToHMS(timeRemaining)}</span>;
// }

// PoolTimer.propTypes = {
//   initialTime: PropTypes.number,
// };

// export default PoolTimer;

import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

function PoolTimer({ initialTime }) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    setTimeRemaining(initialTime); // Reset the timer when initialTime changes
  }, [initialTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearTimeout(timer);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining]);

  function millisecondsToHMS(milliseconds) {
    var seconds = Math.floor(milliseconds / 1000);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;

    if (h >= 24) {
      const d = Math.floor(h / 24);
      h = h % 24;
      return (
        <div className="flex justify-center items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-16 lg:text-[24px] text-primary-300">
              {d < 10 ? '0' + d : d}
            </span>
            <span className="text-16 lg:text-20 text-primary-300">
              {d > 1 ? 'DAYS' : 'DAY'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-16 lg:text-[24px] text-primary-300">
              {h < 10 ? '0' + h : h}
            </span>
            <span className="text-16 lg:text-20 text-primary-300">
              {h > 1 ? 'HOURS' : 'HOUR'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-16 lg:text-[24px] text-primary-300">
              {m < 10 ? '0' + m : m}
            </span>
            <span className="text-16 lg:text-20 text-primary-300">MIN</span>
          </div>
        </div>
      );
    } else {
      const hDisplay = h < 10 ? '0' + h : h;
      const mDisplay = m < 10 ? '0' + m : m;
      const sDisplay = s < 10 ? '0' + s : s;

      return (
        <div className="flex justify-center items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-16 lg:text-[24px] text-primary-300">
              {hDisplay}
            </span>
            <span className="text-16 lg:text-20 text-primary-300">HOURS</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-16 lg:text-[24px] text-primary-300">
              {mDisplay}
            </span>
            <span className="text-16 lg:text-20 text-primary-300">MIN</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-16 lg:text-[24px] text-primary-300">
              {sDisplay}
            </span>
            <span className="text-16 lg:text-20 text-primary-300">SEC</span>
          </div>
        </div>
      );
    }
  }

  return <span>{millisecondsToHMS(timeRemaining)}</span>;
}

PoolTimer.propTypes = {
  initialTime: PropTypes.number.isRequired,
};

export default PoolTimer;
