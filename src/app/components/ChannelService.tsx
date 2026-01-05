import { useEffect } from 'react';

declare global {
    interface Window {
        ChannelIO: any;
        ChannelIOInitialized: boolean;
    }
}

export default function ChannelService() {
    useEffect(() => {
        // 1. Install Script
        (function () {
            var w = window;
            if (w.ChannelIO) {
                return w.console.error("ChannelIO script included twice.");
            }
            var ch = function () {
                w.ChannelIO.c(arguments);
            };
            w.ChannelIO = ch;
            w.ChannelIO.q = [];
            w.ChannelIO.c = function (args: any) {
                w.ChannelIO.q.push(args);
            };

            function l() {
                if (w.ChannelIOInitialized) {
                    return;
                }
                w.ChannelIOInitialized = true;
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.async = true;
                s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
                var x = document.getElementsByTagName("script")[0];
                if (x.parentNode) {
                    x.parentNode.insertBefore(s, x);
                }
            }

            if (document.readyState === "complete") {
                l();
            } else {
                w.addEventListener("DOMContentLoaded", l);
                w.addEventListener("load", l);
            }
        })();

        // 2. Boot
        // Check for logged-in user (Example using localStorage for now)
        const storedUser = localStorage.getItem('sf_user');
        let memberData = {};

        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                memberData = {
                    memberId: user.id, // Unique User ID
                    profile: {
                        name: user.name,
                        mobileNumber: user.phone,
                        CUSTOM_VALUE_1: user.birth_date,
                        CUSTOM_VALUE_2: user.region
                    }
                };
            } catch (e) {
                console.error("Failed to parse user data for ChannelIO", e);
            }
        }

        const bootOption = {
            "pluginKey": "516b0bb2-01a6-4925-b49b-39616a293944",
            ...memberData
        };

        window.ChannelIO('boot', bootOption);

        // Cleanup on unmount
        return () => {
            window.ChannelIO('shutdown');
        };
    }, []);

    return null;
}
