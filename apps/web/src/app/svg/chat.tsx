'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimate } from 'motion/react';

interface ChatSvgProps {
  animationKey?: number;
}

export default function ChatSvg({ animationKey = 0 }: ChatSvgProps) {
  const [inbox1Ref, animateInbox1] = useAnimate();
  const [inbox2Ref, animateInbox2] = useAnimate();
  const [inbox3Ref, animateInbox3] = useAnimate();
  const latestRunRef = useRef(0);

  useEffect(() => {
    if (animationKey === 0) return;

    const runId = animationKey;
    latestRunRef.current = runId;
    const zAxisTilt = { x: [0, -28, 0], y: [0, 16, 0] };
    const transition = { duration: 1.0, ease: 'easeInOut' as const };

    const run = async () => {
      if (!inbox1Ref.current || !inbox2Ref.current || !inbox3Ref.current) return;

      await animateInbox3(inbox3Ref.current, zAxisTilt, transition);
      if (latestRunRef.current !== runId) return;

      await animateInbox2(inbox2Ref.current, zAxisTilt, transition);
      if (latestRunRef.current !== runId) return;

      await animateInbox1(inbox1Ref.current, zAxisTilt, transition);
    };

    run();
  }, [animationKey, animateInbox1, animateInbox2, animateInbox3, inbox1Ref, inbox2Ref, inbox3Ref]);

      return(
        <>
         <svg width="834" height="954" viewBox="0 0 834 954" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 280)" fill="#674D49"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 270)" fill="#674D49"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 260)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 250)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 240)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 230)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 275)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 265)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 255)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 245)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 235)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 225)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 215)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 205)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 195)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 280)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 270)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 260)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 250)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 240)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 230)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 220)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 210)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 200)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 190)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 180)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 170)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 275)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 265)" fill="#B57972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 255)" fill="#B57972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 245)" fill="#B57972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 235)" fill="#A77A67"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 225)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 215)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 205)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 195)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 185)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 175)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 165)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 155)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 270)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 260)" fill="#AA5E56"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 250)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 240)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 230)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 220)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 210)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 200)" fill="#A77A67"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 190)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 180)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 170)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 160)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 150)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 140)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 265)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 255)" fill="#AA5E56"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 245)" fill="#674D49"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 235)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 225)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 215)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 205)" fill="#A77A67"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 195)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 185)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 175)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 165)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 155)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 145)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 135)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 260)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 250)" fill="#B57972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 240)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 230)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 220)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 210)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 200)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 190)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 180)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 170)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 160)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 150)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 140)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 130)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 255)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 245)" fill="#B57972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 235)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 225)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 215)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 205)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 195)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 185)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 175)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 165)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 155)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 145)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 135)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 125)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 250)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 240)" fill="#B57972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 230)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 220)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 210)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 200)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 190)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 180)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 170)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 160)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 150)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 140)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 130)" fill="#BA8D5E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 120)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 245)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 235)" fill="#B57972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 225)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 215)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 205)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 195)" fill="#A77A67"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 185)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 175)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 165)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 155)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 145)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 135)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 125)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 115)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 240)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 230)" fill="#AA5E56"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 220)" fill="#674D49"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 210)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 200)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 190)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 180)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 170)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 160)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 150)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 140)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 130)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 120)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 110)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 235)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 225)" fill="#AA5E56"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 215)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 205)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 195)" fill="#BF8B78"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 185)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 175)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 165)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 155)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 145)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 135)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 125)" fill="#957350"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 115)" fill="#826153"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 105)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 230)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 220)" fill="#B57972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 210)" fill="#B57972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 200)" fill="#B57972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 190)" fill="#A77A67"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 180)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 170)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 160)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 150)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 140)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 130)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 120)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 110)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 225)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 215)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 205)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 195)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 185)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 175)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 165)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 155)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 145)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 135)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 125)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 115)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 210)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 200)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 190)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 180)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 170)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 160)" fill="#8A6552"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 150)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 140)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 130)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 129.904 205)" fill="#674D49"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 129.904 195)" fill="#674D49"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 129.904 185)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 129.904 175)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 129.904 165)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 129.904 155)" fill="#565972"/>
{/* inbox1 */}
<motion.g ref={inbox1Ref} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
<path d="M92.0877 350.396L35.2488 312.572L92.8372 281.853L92.0877 350.396Z" fill="#6097DF" stroke="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M396.157 21.6562C414.297 11.183 430.627 10.6999 442.021 18.3993L465.399 32.8817L455.357 36.8144C457.402 42.7594 458.51 49.7387 458.51 57.6562V195.206C458.51 234.97 430.594 283.324 396.157 303.206L151.752 444.312C144.507 448.495 137.551 451.084 131.083 452.195L136.899 457.856L132.591 461.657L110.196 449.982C97.4326 444.167 89.3989 429.643 89.3989 408.312V270.763C89.399 230.998 117.315 182.645 151.752 162.763L396.157 21.6562Z" fill="url(#paint0_linear_0_1)"/>
<path d="M396.157 21.6561L396.407 22.0892V22.0892L396.157 21.6561ZM442.021 18.3993L441.741 18.8136L441.749 18.8191L441.758 18.8244L442.021 18.3993ZM465.399 32.8817L465.581 33.3473L466.512 32.9829L465.662 32.4567L465.399 32.8817ZM455.357 36.8144L455.175 36.3488L454.728 36.5236L454.884 36.977L455.357 36.8144ZM458.51 195.206L459.01 195.206V195.206H458.51ZM396.157 303.206L396.407 303.639V303.639L396.157 303.206ZM151.752 444.312L152.002 444.745V444.745L151.752 444.312ZM131.083 452.195L130.998 451.702L130.03 451.869L130.734 452.554L131.083 452.195ZM136.899 457.856L137.23 458.231L137.634 457.874L137.248 457.498L136.899 457.856ZM132.591 461.657L132.36 462.1L132.665 462.259L132.922 462.032L132.591 461.657ZM110.196 449.982L110.427 449.539L110.415 449.533L110.403 449.527L110.196 449.982ZM89.3989 270.763H88.8989V270.763H89.3989ZM151.752 162.763L151.502 162.33V162.33L151.752 162.763ZM396.157 21.6561L396.407 22.0892C414.451 11.6714 430.563 11.26 441.741 18.8136L442.021 18.3993L442.301 17.985C430.691 10.1398 414.143 10.6947 395.907 21.2231L396.157 21.6561ZM442.021 18.3993L441.758 18.8244L465.136 33.3068L465.399 32.8817L465.662 32.4567L442.284 17.9743L442.021 18.3993ZM465.399 32.8817L465.217 32.4162L455.175 36.3488L455.357 36.8144L455.539 37.2799L465.581 33.3473L465.399 32.8817ZM455.357 36.8144L454.884 36.977C456.908 42.8613 458.01 49.7845 458.01 57.6562H458.51H459.01C459.01 49.6929 457.895 42.6574 455.83 36.6517L455.357 36.8144ZM458.51 57.6562H458.01V195.206H458.51H459.01V57.6562H458.51ZM458.51 195.206H458.01C458.01 214.98 451.066 236.924 439.814 256.412C428.563 275.9 413.031 292.886 395.907 302.773L396.157 303.206L396.407 303.639C413.719 293.644 429.364 276.512 440.68 256.912C451.996 237.312 459.01 215.197 459.01 195.206L458.51 195.206ZM396.157 303.206L395.907 302.773L151.502 443.879L151.752 444.312L152.002 444.745L396.407 303.639L396.157 303.206ZM151.752 444.312L151.502 443.879C144.299 448.038 137.398 450.603 130.998 451.702L131.083 452.195L131.167 452.688C137.704 451.565 144.716 448.952 152.002 444.745L151.752 444.312ZM131.083 452.195L130.734 452.554L136.55 458.215L136.899 457.856L137.248 457.498L131.431 451.837L131.083 452.195ZM136.899 457.856L136.568 457.481L132.261 461.282L132.591 461.657L132.922 462.032L137.23 458.231L136.899 457.856ZM132.591 461.657L132.822 461.214L110.427 449.539L110.196 449.982L109.965 450.426L132.36 462.1L132.591 461.657ZM110.196 449.982L110.403 449.527C97.8832 443.823 89.8989 429.53 89.8989 408.312H89.3989H88.8989C88.8989 429.756 96.9821 444.511 109.988 450.437L110.196 449.982ZM89.3989 408.312H89.8989V270.763H89.3989H88.8989V408.312H89.3989ZM89.3989 270.763H89.8989C89.899 250.989 96.8434 229.045 108.095 209.557C119.346 190.068 134.878 173.083 152.002 163.196L151.752 162.763L151.502 162.33C134.19 172.325 118.545 189.457 107.229 209.057C95.9128 228.657 88.899 250.772 88.8989 270.763H89.3989ZM151.752 162.763L152.002 163.196L396.407 22.0892L396.157 21.6561L395.907 21.2231L151.502 162.33L151.752 162.763Z" fill="black"/>
<rect x="0.866025" y="0.5" width="424.213" height="279.55" rx="71" transform="matrix(0.866025 -0.5 0 1 114.403 213.54)" fill="white" stroke="black" stroke-width="2"/>
<g filter="url(#filter0_f_0_1)">
<path d="M360 326.014C360 286.25 387.917 237.896 422.354 218.014L483 183V279.774L360 350.788V326.014Z" fill="#1E3C6F"/>
</g>
<path d="M114.918 365.08L60.7467 329.567L114.848 299.865L114.918 365.08Z" fill="white" stroke="black"/>
<path d="M88.8989 313.499V284.499L114.899 299.499L88.8989 313.499Z" fill="#6097DF"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(0.42158 -1.11691 0.743221 0.0842197 289.522 236.389)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(-0.42158 -0.630115 -0.743221 0.942418 288.105 237.052)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(-0.42158 -0.630115 -0.743221 0.942418 329.505 213.149)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(0.42158 -1.11691 0.743221 0.0842197 330.45 212.604)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(-0.42158 -0.630115 -0.743221 0.942418 370.203 189.653)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(0.42158 -1.11691 0.743221 0.0842197 371.148 189.107)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(-0.42158 -0.630115 -0.743221 0.942418 410.9 166.156)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(0.42158 -1.11691 0.743221 0.0842197 412.547 165.205)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(-0.42158 -0.630115 -0.743221 0.942418 451.598 142.659)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(0.42158 -1.11691 0.743221 0.0842197 193.522 343.388)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(-0.42158 -0.630115 -0.743221 0.942418 192.105 344.051)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(-0.42158 -0.630115 -0.743221 0.942418 233.505 320.149)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(0.42158 -1.11691 0.743221 0.0842197 234.45 319.604)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(-0.42158 -0.630115 -0.743221 0.942418 274.203 296.652)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(0.42158 -1.11691 0.743221 0.0842197 275.148 296.106)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(-0.42158 -0.630115 -0.743221 0.942418 314.9 273.155)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(0.42158 -1.11691 0.743221 0.0842197 316.547 272.205)" stroke="#95B4EA" stroke-width="6"/>
<line y1="-3" x2="47.6908" y2="-3" transform="matrix(-0.42158 -0.630115 -0.743221 0.942418 355.598 249.658)" stroke="#95B4EA" stroke-width="6"/>
<circle cx="12" cy="12" r="12" transform="matrix(0.866025 -0.5 0 1 152 236.5)" fill="black"/>
<ellipse cx="12.5" cy="12" rx="12.5" ry="12" transform="matrix(0.866025 -0.5 0 1 181.445 219.5)" fill="black"/>
<circle cx="12" cy="12" r="12" transform="matrix(0.866025 -0.5 0 1 211.756 202)" fill="black"/>
</motion.g>

<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 904)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 894)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 884)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 874)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 854)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 844)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 834)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 0 824)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 909)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 899)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 889)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 879)" fill="#5D6043"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 869)" fill="#5D6043"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 859)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 849)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 839)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 829)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 819)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 8.66016 809)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 924)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 914)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 904)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 894)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 884)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 874)" fill="#5D6043"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 864)" fill="#5D6043"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 854)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 844)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 834)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 824)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 814)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 804)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 17.3203 794)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 929)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 919)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 909)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 899)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 889)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 879)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 869)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 859)" fill="#5D6043"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 849)" fill="#5D6043"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 839)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 829)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 819)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 809)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 799)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 25.981 789)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 924)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 914)" fill="#F69784"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 904)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 894)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 884)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 874)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 864)" fill="#BBA386"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 854)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 844)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 834)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 824)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 814)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 804)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 794)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 34.6411 784)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 919)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 909)" fill="#F69784"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 899)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 889)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 879)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 869)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 859)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 849)" fill="#BBA386"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 839)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 829)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 819)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 809)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 799)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 789)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 43.3013 779)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 914)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 904)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 894)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 884)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 874)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 864)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 854)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 844)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 834)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 824)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 814)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 804)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 794)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 784)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 51.9614 774)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 909)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 899)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 889)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 879)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 869)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 859)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 849)" fill="#BBA386"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 839)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 829)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 819)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 809)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 799)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 789)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 779)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 60.6216 769)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 904)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 894)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 884)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 874)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 864)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 854)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 844)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 834)" fill="#BBA386"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 824)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 814)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 804)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 794)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 784)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 774)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 69.2822 764)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 899)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 889)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 879)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 869)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 859)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 849)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 839)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 829)" fill="#BBA386"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 819)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 809)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 799)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 789)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 779)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 77.9424 769)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 894)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 884)" fill="#F69784"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 874)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 864)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 854)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 844)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 834)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 824)" fill="#BBA386"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 814)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 804)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 794)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 784)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 774)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 86.6025 764)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 889)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 879)" fill="#F69784"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 869)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 859)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 849)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 839)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 829)" fill="#BBA386"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 819)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 809)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 799)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 789)" fill="#5F694A"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 779)" fill="#959D58"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 95.2627 769)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 884)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 874)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 864)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 854)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 844)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 834)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 824)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 814)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 804)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 794)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 784)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 103.923 774)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 869)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 859)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 849)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 839)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 829)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 819)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 809)" fill="#687253"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 799)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 112.583 789)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 844)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 834)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 824)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 814)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 121.244 804)" fill="#3A3A50"/>
{/* inbox2 */}
<motion.g ref={inbox2Ref} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
<path fill-rule="evenodd" clip-rule="evenodd" d="M816.166 95.1851L833.166 101.185C833.566 101.326 833.62 101.87 833.256 102.086L804.756 119.086L804.345 119.331C804.336 119.337 804.324 119.334 804.318 119.325C804.31 119.312 804.291 119.312 804.284 119.326L766.533 193.716C766.016 194.736 765 194.899 765 193.962V126.121C765 125.574 765.38 124.91 765.854 124.628L815.123 95.3824C815.271 95.2943 815.407 95.2559 815.524 95.2567C815.599 95.2573 815.677 95.2305 815.718 95.167C815.761 95.0998 815.844 95.0711 815.919 95.0977L816.166 95.1851Z" fill="#6CA4ED"/>
<path d="M816.166 95.1851L815.999 95.6564L816 95.6566L816.166 95.1851ZM833.166 101.185L833.333 100.714L833.332 100.714L833.166 101.185ZM833.256 102.086L833 101.657L833 101.657L833.256 102.086ZM804.756 119.086L805.012 119.516L805.012 119.516L804.756 119.086ZM766.533 193.716L766.979 193.943L766.979 193.943L766.533 193.716ZM765 126.121L764.5 126.121V126.121H765ZM765.854 124.628L765.598 124.199L765.598 124.199L765.854 124.628ZM815.123 95.3824L814.868 94.9524L814.868 94.9524L815.123 95.3824ZM815.718 95.167L815.296 94.8978L815.718 95.167ZM815.919 95.0977L815.752 95.569L815.919 95.0977ZM804.318 119.325L804.746 119.066L804.318 119.325ZM804.284 119.326L803.838 119.1L804.284 119.326ZM804.345 119.331L804.601 119.761L804.345 119.331ZM816.166 95.1851L816 95.6566L833 101.657L833.166 101.185L833.332 100.714L816.332 94.7136L816.166 95.1851ZM833.256 102.086L833 101.657L804.5 118.657L804.756 119.086L805.012 119.516L833.512 102.516L833.256 102.086ZM804.756 119.086L804.5 118.657L804.089 118.902L804.345 119.331L804.601 119.761L805.012 119.516L804.756 119.086ZM804.284 119.326L803.838 119.1L766.087 193.49L766.533 193.716L766.979 193.943L804.73 119.552L804.284 119.326ZM766.533 193.716L766.087 193.49C765.872 193.914 765.6 194.062 765.493 194.079C765.454 194.086 765.482 194.072 765.515 194.104C765.541 194.129 765.5 194.113 765.5 193.962H765H764.5C764.5 194.28 764.586 194.595 764.818 194.821C765.058 195.054 765.372 195.112 765.652 195.067C766.182 194.982 766.677 194.539 766.979 193.943L766.533 193.716ZM765 193.962H765.5V126.121H765H764.5V193.962H765ZM765 126.121L765.5 126.121C765.5 125.955 765.561 125.737 765.683 125.523C765.806 125.31 765.963 125.145 766.109 125.058L765.854 124.628L765.598 124.199C765.27 124.393 765.001 124.701 764.815 125.027C764.629 125.352 764.5 125.74 764.5 126.121L765 126.121ZM765.854 124.628L766.109 125.058L815.378 95.8123L815.123 95.3824L814.868 94.9524L765.598 124.199L765.854 124.628ZM815.123 95.3824L815.378 95.8123C815.469 95.7585 815.515 95.7567 815.52 95.7567L815.524 95.2567L815.528 94.7568C815.298 94.7551 815.074 94.8301 814.868 94.9524L815.123 95.3824ZM815.919 95.0977L815.752 95.569L815.999 95.6564L816.166 95.1851L816.333 94.7138L816.086 94.6264L815.919 95.0977ZM815.718 95.167L816.139 95.4361C816.057 95.565 815.897 95.6201 815.752 95.569L815.919 95.0977L816.086 94.6264C815.792 94.5222 815.464 94.6347 815.296 94.8978L815.718 95.167ZM804.318 119.325L804.746 119.066C804.535 118.717 804.023 118.736 803.838 119.1L804.284 119.326L804.73 119.552C804.559 119.889 804.085 119.906 803.89 119.583L804.318 119.325ZM804.345 119.331L804.089 118.902C804.316 118.767 804.609 118.84 804.746 119.066L804.318 119.325L803.89 119.583C804.038 119.828 804.355 119.907 804.601 119.761L804.345 119.331ZM815.524 95.2567L815.52 95.7567C815.692 95.758 815.971 95.6987 816.139 95.4361L815.718 95.167L815.296 94.8978C815.339 94.831 815.395 94.7943 815.437 94.7764C815.476 94.7596 815.508 94.7566 815.528 94.7568L815.524 95.2567ZM833.166 101.185L832.999 101.657L833 101.657L833.256 102.086L833.512 102.516C834.241 102.082 834.131 100.996 833.333 100.714L833.166 101.185Z" fill="black"/>
<path d="M782.866 200.634V132.584L832.142 103.744L782.866 200.634Z" fill="white" stroke="black" stroke-width="2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M694.758 86.6562C712.898 76.183 729.228 75.6999 740.622 83.3993L764 97.8817L753.958 101.814C756.003 107.759 757.111 114.739 757.111 122.656V260.206C757.111 299.97 729.195 348.324 694.758 368.206L450.354 509.312C443.109 513.495 436.152 516.084 429.684 517.195L435.5 522.856L431.192 526.657L408.797 514.982C396.034 509.167 388 494.643 388 473.312V335.763C388 295.998 415.917 247.645 450.354 227.763L694.758 86.6562Z" fill="url(#paint1_linear_0_1)"/>
<path d="M694.758 86.6561L695.258 87.5222V87.5222L694.758 86.6561ZM740.622 83.3993L740.062 84.2279L740.079 84.239L740.095 84.2494L740.622 83.3993ZM764 97.8817L764.365 98.8129L766.226 98.0841L764.527 97.0316L764 97.8817ZM753.958 101.814L753.593 100.883L752.701 101.233L753.012 102.14L753.958 101.814ZM757.111 260.206L758.111 260.206V260.206H757.111ZM694.758 368.206L695.258 369.072V369.072L694.758 368.206ZM450.354 509.312L450.854 510.178V510.178L450.354 509.312ZM429.684 517.195L429.514 516.21L427.579 516.542L428.986 517.912L429.684 517.195ZM435.5 522.856L436.162 523.606L436.971 522.892L436.197 522.14L435.5 522.856ZM431.192 526.657L430.73 527.544L431.339 527.861L431.854 527.407L431.192 526.657ZM408.797 514.982L409.259 514.096L409.236 514.083L409.211 514.072L408.797 514.982ZM388 335.763H387V335.763H388ZM450.354 227.763L449.854 226.897H449.854L450.354 227.763ZM694.758 86.6561L695.258 87.5222C713.206 77.1598 729.1 76.8202 740.062 84.2279L740.622 83.3993L741.182 82.5707C729.356 74.5796 712.59 75.2063 694.258 85.7901L694.758 86.6561ZM740.622 83.3993L740.095 84.2494L763.473 98.7318L764 97.8817L764.527 97.0316L741.149 82.5492L740.622 83.3993ZM764 97.8817L763.635 96.9506L753.593 100.883L753.958 101.814L754.323 102.745L764.365 98.8129L764 97.8817ZM753.958 101.814L753.012 102.14C755.015 107.963 756.111 114.83 756.111 122.656H757.111H758.111C758.111 114.647 756.99 107.556 754.904 101.489L753.958 101.814ZM757.111 122.656H756.111V260.206H757.111H758.111V122.656H757.111ZM757.111 260.206H756.111C756.111 279.871 749.202 301.729 737.982 321.162C726.763 340.594 711.289 357.507 694.258 367.34L694.758 368.206L695.258 369.072C712.664 359.022 728.366 341.818 739.714 322.162C751.063 302.506 758.111 280.305 758.111 260.206L757.111 260.206ZM694.758 368.206L694.258 367.34L449.854 508.446L450.354 509.312L450.854 510.178L695.258 369.072L694.758 368.206ZM450.354 509.312L449.854 508.446C442.692 512.581 435.847 515.122 429.514 516.21L429.684 517.195L429.853 518.181C436.458 517.046 443.525 514.409 450.854 510.178L450.354 509.312ZM429.684 517.195L428.986 517.912L434.803 523.573L435.5 522.856L436.197 522.14L430.381 516.479L429.684 517.195ZM435.5 522.856L434.838 522.107L430.531 525.907L431.192 526.657L431.854 527.407L436.162 523.606L435.5 522.856ZM431.192 526.657L431.655 525.77L409.259 514.096L408.797 514.982L408.335 515.869L430.73 527.544L431.192 526.657ZM408.797 514.982L409.211 514.072C396.935 508.479 389 494.417 389 473.312H388H387C387 494.868 395.133 509.855 408.382 515.892L408.797 514.982ZM388 473.312H389V335.763H388H387V473.312H388ZM388 335.763H389C389 316.097 395.91 294.239 407.129 274.807C418.348 255.374 433.823 238.461 450.854 228.629L450.354 227.763L449.854 226.897C432.447 236.946 416.745 254.151 405.397 273.807C394.049 293.463 387 315.664 387 335.763H388ZM450.354 227.763L450.854 228.629L695.258 87.5222L694.758 86.6561L694.258 85.7901L449.854 226.897L450.354 227.763Z" fill="black"/>
<rect x="0.866025" y="0.5" width="424.213" height="279.55" rx="71" transform="matrix(0.866025 -0.5 0 1 413.005 278.54)" fill="white" stroke="black" stroke-width="2"/>
<rect width="194.44" height="21.7773" transform="matrix(0.866025 -0.5 0 1 446.332 319.329)" fill="#95B4EA"/>
<rect width="346.66" height="21.7773" transform="matrix(0.866025 -0.5 0 1 446.332 365.993)" fill="#95B4EA"/>
<rect width="194.44" height="21.7773" transform="matrix(0.866025 -0.5 0 1 577.773 341.104)" fill="#95B4EA"/>
<rect width="118.22" height="21.7773" transform="matrix(0.866025 -0.5 0 1 446.332 416.548)" fill="#95B4EA"/>
<rect width="118.22" height="21.7773" transform="matrix(0.866025 -0.5 0 1 643.884 211.22)" fill="#95B4EA"/>
</motion.g>
{/* inbox3 */}
<motion.g ref={inbox3Ref} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
<path d="M92.0877 725.396L35.2488 687.572L92.8372 656.853L92.0877 725.396Z" fill="#6097DF" stroke="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M396.157 396.656C414.297 386.183 430.627 385.7 442.021 393.399L465.399 407.882L455.357 411.814C457.402 417.759 458.51 424.739 458.51 432.656V570.206C458.51 609.97 430.594 658.324 396.157 678.206L151.752 819.312C144.507 823.495 137.551 826.084 131.083 827.195L136.899 832.856L132.591 836.657L110.196 824.982C97.4326 819.167 89.3989 804.643 89.3989 783.312V645.763C89.399 605.998 117.315 557.645 151.752 537.763L396.157 396.656Z" fill="url(#paint2_linear_0_1)"/>
<path d="M396.157 396.656L396.407 397.089V397.089L396.157 396.656ZM442.021 393.399L441.741 393.814L441.749 393.819L441.758 393.824L442.021 393.399ZM465.399 407.882L465.581 408.347L466.512 407.983L465.662 407.457L465.399 407.882ZM455.357 411.814L455.175 411.349L454.728 411.524L454.884 411.977L455.357 411.814ZM458.51 570.206L459.01 570.206V570.206H458.51ZM396.157 678.206L396.407 678.639V678.639L396.157 678.206ZM151.752 819.312L152.002 819.745V819.745L151.752 819.312ZM131.083 827.195L130.998 826.702L130.03 826.869L130.734 827.554L131.083 827.195ZM136.899 832.856L137.23 833.231L137.634 832.874L137.248 832.498L136.899 832.856ZM132.591 836.657L132.36 837.1L132.665 837.259L132.922 837.032L132.591 836.657ZM110.196 824.982L110.427 824.539L110.415 824.533L110.403 824.527L110.196 824.982ZM89.3989 645.763H88.8989V645.763H89.3989ZM151.752 537.763L151.502 537.33V537.33L151.752 537.763ZM396.157 396.656L396.407 397.089C414.451 386.671 430.563 386.26 441.741 393.814L442.021 393.399L442.301 392.985C430.691 385.14 414.143 385.695 395.907 396.223L396.157 396.656ZM442.021 393.399L441.758 393.824L465.136 408.307L465.399 407.882L465.662 407.457L442.284 392.974L442.021 393.399ZM465.399 407.882L465.217 407.416L455.175 411.349L455.357 411.814L455.539 412.28L465.581 408.347L465.399 407.882ZM455.357 411.814L454.884 411.977C456.908 417.861 458.01 424.784 458.01 432.656H458.51H459.01C459.01 424.693 457.895 417.657 455.83 411.652L455.357 411.814ZM458.51 432.656H458.01V570.206H458.51H459.01V432.656H458.51ZM458.51 570.206H458.01C458.01 589.98 451.066 611.924 439.814 631.412C428.563 650.9 413.031 667.886 395.907 677.773L396.157 678.206L396.407 678.639C413.719 668.644 429.364 651.512 440.68 631.912C451.996 612.312 459.01 590.197 459.01 570.206L458.51 570.206ZM396.157 678.206L395.907 677.773L151.502 818.879L151.752 819.312L152.002 819.745L396.407 678.639L396.157 678.206ZM151.752 819.312L151.502 818.879C144.299 823.038 137.398 825.603 130.998 826.702L131.083 827.195L131.167 827.688C137.704 826.565 144.716 823.952 152.002 819.745L151.752 819.312ZM131.083 827.195L130.734 827.554L136.55 833.215L136.899 832.856L137.248 832.498L131.431 826.837L131.083 827.195ZM136.899 832.856L136.568 832.481L132.261 836.282L132.591 836.657L132.922 837.032L137.23 833.231L136.899 832.856ZM132.591 836.657L132.822 836.214L110.427 824.539L110.196 824.982L109.965 825.426L132.36 837.1L132.591 836.657ZM110.196 824.982L110.403 824.527C97.8832 818.823 89.8989 804.53 89.8989 783.312H89.3989H88.8989C88.8989 804.756 96.9821 819.511 109.988 825.437L110.196 824.982ZM89.3989 783.312H89.8989V645.763H89.3989H88.8989V783.312H89.3989ZM89.3989 645.763H89.8989C89.899 625.989 96.8434 604.045 108.095 584.557C119.346 565.068 134.878 548.083 152.002 538.196L151.752 537.763L151.502 537.33C134.19 547.325 118.545 564.457 107.229 584.057C95.9128 603.657 88.899 625.772 88.8989 645.763H89.3989ZM151.752 537.763L152.002 538.196L396.407 397.089L396.157 396.656L395.907 396.223L151.502 537.33L151.752 537.763Z" fill="black"/>
<rect x="0.866025" y="0.5" width="424.213" height="279.55" rx="71" transform="matrix(0.866025 -0.5 0 1 114.403 588.54)" fill="white" stroke="black" stroke-width="2"/>
<rect width="241" height="22" transform="matrix(0.866025 -0.5 0 1 190 637.499)" fill="#95B4EA"/>
<rect width="99" height="22" transform="matrix(0.866025 -0.5 0 1 191 669.499)" fill="#95B4EA"/>
<rect width="168" height="22" transform="matrix(0.866025 -0.5 0 1 192 704.999)" fill="#95B4EA"/>
<rect width="238" height="22" transform="matrix(0.866025 -0.5 0 1 193 738.999)" fill="#95B4EA"/>
<rect width="194" height="22" transform="matrix(0.866025 -0.5 0 1 193 778.999)" fill="#95B4EA"/>
<path d="M114.918 740.08L60.7467 704.566L114.848 674.865L114.918 740.08Z" fill="white" stroke="black"/>
<path d="M88.8989 688.499V659.499L114.899 674.499L88.8989 688.499Z" fill="#6097DF"/>
<circle cx="12" cy="12" r="12" transform="matrix(0.866025 -0.5 0 1 193 593.5)" fill="black"/>
<ellipse cx="12.5" cy="12" rx="12.5" ry="12" transform="matrix(0.866025 -0.5 0 1 222.445 576.5)" fill="black"/>
<circle cx="12" cy="12" r="12" transform="matrix(0.866025 -0.5 0 1 252.756 559)" fill="black"/>
</motion.g>

<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 687 457)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 687 447)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 687 437)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 687 427)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 687 417)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 687 407)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 687 397)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 482)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 472)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 462)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 452)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 442)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 432)" fill="#555157"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 422)" fill="#555157"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 412)" fill="#555157"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 402)" fill="#555157"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 392)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 382)" fill="#514E59"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 695.66 372)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 477)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 467)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 457)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 447)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 437)" fill="#C9A495"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 427)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 417)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 407)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 397)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 387)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 377)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 367)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 704.32 357)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 472)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 462)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 452)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 442)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 432)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 422)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 412)" fill="#C9A495"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 402)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 392)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 382)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 372)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 362)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 352)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 712.98 342)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 467)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 457)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 447)" fill="#6C6E85"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 437)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 427)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 417)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 407)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 397)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 387)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 377)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 367)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 357)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 347)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 721.641 337)" fill="#565972"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 462)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 452)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 442)" fill="#E19B9B"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 432)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 422)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 412)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 402)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 392)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 382)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 372)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 362)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 352)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 342)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 730.301 332)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 457)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 447)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 437)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 427)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 417)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 407)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 397)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 387)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 377)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 367)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 357)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 347)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 337)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 738.962 327)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 452)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 442)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 432)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 422)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 412)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 402)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 392)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 382)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 372)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 362)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 352)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 342)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 332)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 747.622 322)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 447)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 437)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 427)" fill="#E19B9B"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 417)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 407)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 397)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 387)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 377)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 367)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 357)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 347)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 337)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 327)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 756.282 317)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 442)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 432)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 422)" fill="#6C6E85"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 412)" fill="#3A3A50"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 402)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 392)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 382)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 372)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 362)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 352)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 342)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 332)" fill="#888084"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 322)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 764.942 312)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 437)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 427)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 417)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 407)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 397)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 387)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 377)" fill="#C9A495"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 367)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 357)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 347)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 337)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 327)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 317)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 773.603 307)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 432)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 422)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 412)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 402)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 392)" fill="#C9A495"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 382)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 372)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 362)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 352)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 342)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 332)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 322)" fill="#5D585F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 782.263 312)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 427)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 417)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 407)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 397)" fill="#FFCBB0"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 387)" fill="#F6AE9F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 377)" fill="#555157"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 367)" fill="#555157"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 357)" fill="#555157"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 347)" fill="#555157"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 337)" fill="#555157"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 327)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 790.923 317)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 799.583 392)" fill="#46465E"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 799.583 382)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 799.583 372)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 799.583 362)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 799.583 352)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 799.583 342)" fill="#46465F"/>
<rect width="10" height="10" transform="matrix(0.866025 -0.5 0 1 799.583 332)" fill="#46465F"/>
<circle cx="738" cy="583" r="7.5" stroke="white"/>
<defs>
<filter id="filter0_f_0_1" x="355.6" y="178.6" width="131.8" height="176.588" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="2.2" result="effect1_foregroundBlur_0_1"/>
</filter>
<linearGradient id="paint0_linear_0_1" x1="277.399" y1="13.1406" x2="277.399" y2="461.657" gradientUnits="userSpaceOnUse">
<stop stop-color="#7BB4FF"/>
<stop offset="0.524038" stop-color="#134586"/>
</linearGradient>
<linearGradient id="paint1_linear_0_1" x1="576" y1="78.1406" x2="576" y2="526.657" gradientUnits="userSpaceOnUse">
<stop stop-color="#7BB4FF"/>
<stop offset="0.524038" stop-color="#134586"/>
</linearGradient>
<linearGradient id="paint2_linear_0_1" x1="277.399" y1="388.141" x2="277.399" y2="836.657" gradientUnits="userSpaceOnUse">
<stop stop-color="#7BB4FF"/>
<stop offset="0.524038" stop-color="#134586"/>
</linearGradient>
</defs>
</svg>
        </>
      )  
}
