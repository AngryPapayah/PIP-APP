import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';

const Typewriter = ({text, speed = 80, style, onAnimationComplete}) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let i = 0;
        // reset text when it changes
        setDisplayText('');

        const typing = setInterval(() => {
            if (i < text.length) {
                setDisplayText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typing);
                // Call the callback when the animation finishes
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
            }
        }, speed);

        return () => clearInterval(typing);
    }, [text, speed, onAnimationComplete]);

    return <Text style={style}>{displayText}</Text>;
};

export default Typewriter;
