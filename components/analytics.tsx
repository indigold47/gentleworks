"use client";

import { useEffect } from "react";
import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";
import { plugin as engagementPlugin } from "@amplitude/engagement-browser";

export function Analytics() {
  useEffect(() => {
    // Amplitude
    const amplitudeKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (amplitudeKey) {
      amplitude.add(engagementPlugin());
      amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
      amplitude.init(amplitudeKey, {
        autocapture: true,
        serverUrl: process.env.NEXT_PUBLIC_AMPLITUDE_SERVER_URL,
      });
    }

    // Microsoft Clarity
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (clarityId) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window,document,"clarity","script","${clarityId}");
      `;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
