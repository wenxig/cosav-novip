//import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  // any props that come into the component
}
const BaseMotionDiv = ({ children, ...props }: Props) => {
  return (
    /*
    <motion.div
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'auto',
        backgroundColor:'black'
      }}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    >*/
    <>{children}</>
    /*</motion.div>*/
  );
};

export default BaseMotionDiv;
