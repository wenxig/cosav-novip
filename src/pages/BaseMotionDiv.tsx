import { motion } from "framer-motion"
import { ReactNode } from "react"

interface Props {
  children?: ReactNode
  // any props that come into the component
}
const BaseMotionDiv = ({ children, }: Props) => {

  /*
  useEffect(() => {
    // 進入畫面時先滾動到頁面頂部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // 強制直式顯示
    const style = document.createElement('style');
    style.innerHTML = `
      @media screen and (orientation: landscape) {
        html {
          transform: rotate(-90deg);
          transform-origin: left top;
          width: 100vh;
          height: 100vw;
          position: absolute;
          top: 100%;
          left: 0;
        }
        body {
          width: 100vh;
          height: 100vw;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
        }
        #root {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          position: relative;
        }
      }
    `;
    document.head.appendChild(style);

    // 組件卸載時移除樣式
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  */

  return (
    <motion.div
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'auto'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}

export default BaseMotionDiv