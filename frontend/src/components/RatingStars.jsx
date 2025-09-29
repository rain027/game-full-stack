// Path: src/components/RatingStars.jsx
import { useState } from "react"
import { FaStar } from "react-icons/fa"
import styles from "./RatingStars.module.css"

export default function RatingStars({ rating, onRate }) {
  const [hover, setHover] = useState(0)
  
  return (
    <div className={styles.stars}>
      {[...Array(5)].map((_, i) => {
        const val = i + 1
        return (
          <FaStar
            key={i}
            className={val <= (hover || rating) ? styles.active : styles.inactive}
            onMouseEnter={() => setHover(val)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onRate(val)}
          />
        )
      })}
    </div>
  )
}