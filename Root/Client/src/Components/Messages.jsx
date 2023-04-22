import { useRef, useEffect } from 'react';
import Styles from '../styles/Messages.module.css';

function Messages({ children }) {
  const div = useRef(null);
  const prevScrollTop = useRef(null);

  useEffect(() => {
    if (div.current && prevScrollTop.current !== null) {
      if (
        div.current.scrollHeight - div.current.clientHeight >
          div.current.scrollTop &&
        div.current.scrollTop >= prevScrollTop.current
      ) {
        div.current.scrollTo({
          top: div.current.scrollHeight - div.current.clientHeight,
          behavior: 'auto',
        });
        prevScrollTop.current = div.current.scrollTop;
      } else {
        if (
          div.current.scrollHeight - div.current.clientHeight ==
          div.current.scrollTop
        ) {
          prevScrollTop.current = div.current.scrollTop;
        }
      }
    } else {
      prevScrollTop.current = div.current.scrollTop;
    }
  }, [children]);

  return (
    <div className='Messages'>
      <div ref={div} id={Styles.outerDiv}>
        {children}
      </div>
    </div>
  );
}

export default Messages;
