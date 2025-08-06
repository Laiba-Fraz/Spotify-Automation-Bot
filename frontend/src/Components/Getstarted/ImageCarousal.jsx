// "use client"

// import { useState } from "react"
// import classes from "./ImageCarousal.module.css"


// function ImageCarousel({ images }) {
//   const [currentIndex, setCurrentIndex] = useState(0)

//   const goToSlide = (index) => {
//     setCurrentIndex(index)
//   }

//   if (images.length === 0) return null

//   return (
//     <div className={classes.carousel}>
//       <div className={classes.imageContainer}>
//         <img
//           src={images[currentIndex].src || "/placeholder.svg"}
//           alt={images[currentIndex].alt}
//           className={classes.carouselImage}
//         />
//       </div>

//       {images.length > 1 && (
//         <div className={classes.dotsContainer}>
//           {images.map((_, index) => (
//             <button
//               key={index}
//               className={`${classes.dot} ${index === currentIndex ? classes.activeDot : ""}`}
//               onClick={() => goToSlide(index)}
//               aria-label={`Go to image ${index + 1}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default ImageCarousel



"use client"

import { useState, useEffect } from "react"
import classes from "./ImageCarousal.module.css"

function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  // Auto-play functionality
  useEffect(() => {
    if (images.length <= 1) return // Don't auto-play if there's only one image or no images

    const interval = setInterval(() => {
      goToNextSlide()
    }, 5000) // Change image every 5 seconds

    // Cleanup interval on component unmount or when dependencies change
    return () => clearInterval(interval)
  }, [images.length]) // Re-run effect if images array length changes

  if (images.length === 0) return null

  return (
    <div className={classes.carousel}>
      <div className={classes.imageContainer}>
        <img
          src={images[currentIndex].src || "/placeholder.svg"}
          alt={images[currentIndex].alt}
          className={classes.carouselImage}
        />
      </div>

      {images.length > 1 && (
        <div className={classes.dotsContainer}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${classes.dot} ${index === currentIndex ? classes.activeDot : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageCarousel
